ig.module(
	'game.entities.my-movement'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityMyMovement = ig.Entity.extend({

	_wmIgnore : false, // zapobiega wyswietlaniu jednostki w Welmeisterze
	size: {x: 32, y: 32}, // standardowy rozmiar pola

	type: ig.Entity.TYPE.B, // Player UNfriendly group
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	// Wlasne wlasciwosci
	tileSize: 32,
	targetY: 0, // obliczane automatycznie na podstawie tileSize
	targetX: 0, // obliczane automatycznie na podstawie tileSize
	direction: null, // kierunek w ktorym jednostka sie porusza
	speed: 100,

	falling: false, // okresla czy: jednostka moze spadac
	consumable: false, // okresla czy: jednostka moze byc zjedzona
	crushable: false, // okresla czy: jednostka ginie od spadajacych obiektow
	blocksEnemyPath: true, // okresla czy: wrogowie traktuja pole jako sciane
	supportsObjects: false, // okresla czy: jednostka utrzymuje spadajace obiekty
	passable: false, // okresla czy: gracz moze wejsc na pole (np. infotron)
	rounded: false, // okresla czy: inne jednoski moga sie przetaczac po danej jednostce
	pushable: false, // okresla czy jednostka moze byc przesuwana

	animSheet: new ig.AnimationSheet('media/infotron.png', 32, 32),

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.addAnim('idle', 1, [0]);

		this.correctPosition();
	},

	// wycentrowanie jednostki wzgledem siatki
	correctPosition: function () {
		var xMod = this.pos.x.round() % this.tileSize;
		var yMod = this.pos.y.round() % this.tileSize;
		this.pos.x = this.pos.x.round() - xMod;
		this.pos.y = this.pos.y.round() - yMod;
	},

	// tile-aligned origin (stable while moving between cells)
	getGridPos: function () {
		var ts = this.tileSize;
		return {
			x: Math.floor(this.pos.x / ts) * ts,
			y: Math.floor(this.pos.y / ts) * ts
		};
	},

	isCellOccupied: function (check, ignoreCrushable, ignoreNonBlocking) {
		return this.getEntitiesAt(check, ignoreCrushable, ignoreNonBlocking).length > 0;
	},

	getEntitiesInCell: function (cellX, cellY) {
		var ts = this.tileSize;
		var ents = [];

		for (var i = 0; i < ig.game.entities.length; i++) {
			var ent = ig.game.entities[i];
			if (ent === this || ent._killed) {
				continue;
			}

			var grid = ent.getGridPos ? ent.getGridPos() : {
				x: Math.floor(ent.pos.x / ts) * ts,
				y: Math.floor(ent.pos.y / ts) * ts
			};

			if (grid.x === cellX && grid.y === cellY) {
				ents.push(ent);
				continue;
			}

			var cx = ent.pos.x + ent.size.x * 0.5;
			var cy = ent.pos.y + ent.size.y * 0.5;
			if (cx >= cellX && cx < cellX + ts && cy >= cellY && cy < cellY + ts) {
				ents.push(ent);
			}
		}

		return ents;
	},

	isSupportingEntity: function (ent) {
		if (ent.supportsObjects) {
			return true;
		}
		if (ent.collides === ig.Entity.COLLIDES.FIXED) {
			return true;
		}
		return false;
	},

	entityOccupiesCell: function (ent, cellX, cellY) {
		var ts = this.tileSize;
		return ent.pos.x < cellX + ts && ent.pos.x + ent.size.x > cellX &&
			ent.pos.y < cellY + ts && ent.pos.y + ent.size.y > cellY;
	},

	entityMovingIntoCell: function (ent, cellX, cellY) {
		if (ent.vel.x === 0 && ent.vel.y === 0) {
			return false;
		}
		return ent.targetX === cellX && ent.targetY === cellY;
	},

	isCellSupported: function (check) {
		var cell = this.getNeighborCellPos(check);

		for (var i = 0; i < ig.game.entities.length; i++) {
			var ent = ig.game.entities[i];
			if (ent === this || ent._killed || !this.isSupportingEntity(ent)) {
				continue;
			}

			if (this.entityOccupiesCell(ent, cell.x, cell.y) ||
				this.entityMovingIntoCell(ent, cell.x, cell.y)) {
				return true;
			}
		}

		return false;
	},

	isCellOpenForPath: function (check) {
		return !this.isCellOccupied(check, false, true) && this.canStepToCell(check);
	},

	getNeighborCellPos: function (check) {
		var grid = this.getGridPos();
		var ts = this.tileSize;

		switch (check) {
			case 1: return { x: grid.x - ts, y: grid.y - ts };
			case 2: return { x: grid.x,      y: grid.y - ts };
			case 3: return { x: grid.x + ts, y: grid.y - ts };
			case 4: return { x: grid.x - ts, y: grid.y };
			case 5: return { x: grid.x,      y: grid.y };
			case 6: return { x: grid.x + ts, y: grid.y };
			case 7: return { x: grid.x - ts, y: grid.y + ts };
			case 8: return { x: grid.x,      y: grid.y + ts };
			case 9: return { x: grid.x + ts, y: grid.y + ts };
			default: return { x: grid.x, y: grid.y };
		}
	},

	canStepToCell: function (check) {
		var cell = this.getNeighborCellPos(check);
		var dx = cell.x - this.pos.x;
		var dy = cell.y - this.pos.y;

		if (!dx && !dy) {
			return true;
		}

		var res = ig.game.collisionMap.trace(
			this.pos.x, this.pos.y, dx, dy, this.size.x, this.size.y
		);

		return !res.collision.x && !res.collision.y;
	},

	isCellBlocked: function (check) {
		var ents = this.getEntitiesAt(check);
		for (var i = 0; i < ents.length; i++) {
			var ent = ents[i];
			if (ent === this) {
				continue;
			}
			if (ent.collides === ig.Entity.COLLIDES.FIXED ||
				ent.collides === ig.Entity.COLLIDES.ACTIVE) {
				return true;
			}
		}
		return false;
	},

	getDirectionCell: function (dir) {
		return { up: 2, down: 8, left: 4, right: 6 }[dir];
	},

	isCellMovementBlocked: function (check) {
		var ents = this.getEntitiesInCellForCheck(check);
		for (var i = 0; i < ents.length; i++) {
			var ent = ents[i];
			if (ent === this || ent._killed || ent.passable || ent.consumable) {
				continue;
			}
			if (ent.collides === ig.Entity.COLLIDES.FIXED ||
				ent.collides === ig.Entity.COLLIDES.ACTIVE) {
				return true;
			}
		}
		return false;
	},

	getEntitiesInCellForCheck: function (check) {
		var cell = this.getNeighborCellPos(check);
		return this.getEntitiesInCell(cell.x, cell.y);
	},

	cellHasPassableEntity: function (check) {
		var ents = this.getEntitiesInCellForCheck(check);
		for (var i = 0; i < ents.length; i++) {
			if (ents[i].passable || ents[i].consumable) {
				return true;
			}
		}
		return false;
	},

	canEnterCell: function (check) {
		if (this.isCellMovementBlocked(check)) {
			return false;
		}
		if (this.cellHasPassableEntity(check)) {
			return true;
		}
		return this.canStepToCell(check);
	},

	canMoveInDirection: function (dir) {
		return this.canEnterCell(this.getDirectionCell(dir));
	},

	startGridMove: function (dirr) {
		var grid = this.getGridPos();

		if (dirr === "up") {
			this.vel.y = -this.speed;
			this.vel.x = 0;
			this.targetY = grid.y - this.tileSize;
			this.direction = "up";
		}
		else if (dirr === "down") {
			this.vel.y = this.speed;
			this.vel.x = 0;
			this.targetY = grid.y + this.tileSize;
			this.direction = "down";
		}
		else if (dirr === "left") {
			this.vel.x = -this.speed;
			this.vel.y = 0;
			this.targetX = grid.x - this.tileSize;
			this.direction = "left";
		}
		else if (dirr === "right") {
			this.vel.x = this.speed;
			this.vel.y = 0;
			this.targetX = grid.x + this.tileSize;
			this.direction = "right";
		}
	},

	canReachTarget: function () {
		var dx = 0;
		var dy = 0;

		if (this.direction === "up") {
			dy = this.targetY - this.pos.y;
		}
		else if (this.direction === "down") {
			dy = this.targetY - this.pos.y;
		}
		else if (this.direction === "left") {
			dx = this.targetX - this.pos.x;
		}
		else if (this.direction === "right") {
			dx = this.targetX - this.pos.x;
		}

		if (!dx && !dy) {
			return true;
		}

		var cell = this.getDirectionCell(this.direction);
		if (cell && this.isCellMovementBlocked(cell)) {
			return false;
		}
		if (cell && this.cellHasPassableEntity(cell)) {
			return true;
		}

		var res = ig.game.collisionMap.trace(
			this.pos.x, this.pos.y, dx, dy, this.size.x, this.size.y
		);

		return !res.collision.x && !res.collision.y;
	},

	// stop at tile boundary before physics integration overshoots
	updateGridMovement: function () {
		this._skipPhysicsMove = false;

		if (this.vel.x === 0 && this.vel.y === 0) {
			return;
		}

		var cell = this.getDirectionCell(this.direction);
		var toPassable = cell && this.cellHasPassableEntity(cell);
		var tick = ig.system.tick;

		if (toPassable) {
			this._skipPhysicsMove = true;
			var mx = this.vel.x * tick;
			var my = this.vel.y * tick;

			if (this.direction === "right") {
				mx = Math.min(mx, this.targetX - this.pos.x);
				this.pos.x += mx;
			}
			else if (this.direction === "left") {
				mx = Math.max(mx, this.targetX - this.pos.x);
				this.pos.x += mx;
			}
			else if (this.direction === "down") {
				my = Math.min(my, this.targetY - this.pos.y);
				this.pos.y += my;
			}
			else if (this.direction === "up") {
				my = Math.max(my, this.targetY - this.pos.y);
				this.pos.y += my;
			}
		}

		var reached = false;

		if (this.direction === "up" && this.pos.y <= this.targetY) {
			reached = true;
		}
		else if (this.direction === "down" && this.pos.y >= this.targetY) {
			reached = true;
		}
		else if (this.direction === "left" && this.pos.x <= this.targetX) {
			reached = true;
		}
		else if (this.direction === "right" && this.pos.x >= this.targetX) {
			reached = true;
		}

		if (!reached) {
			return;
		}

		if (!this.canReachTarget()) {
			this.vel.x = 0;
			this.vel.y = 0;
			this.correctPosition();
			return;
		}

		if (this.direction === "up") {
			this.pos.y = this.targetY;
			this.vel.y = 0;
		}
		else if (this.direction === "down") {
			this.pos.y = this.targetY;
			this.vel.y = 0;
		}
		else if (this.direction === "left") {
			this.pos.x = this.targetX;
			this.vel.x = 0;
		}
		else if (this.direction === "right") {
			this.pos.x = this.targetX;
			this.vel.x = 0;
		}

		this.correctPosition();
	},

	// funkcja poruszajaca jednostki
	gotoGrid: function (dirr) {
		if (this.vel.x === 0 && this.vel.y === 0) {
			this.startGridMove(dirr);
		}
		else {
			this.updateGridMovement();
		}
	},

	touches: function( other ) {		
		return !(
			this.pos.x >= other.pos.x + other.size.x ||
			this.pos.x + this.size.x <= other.pos.x ||
			this.pos.y >= other.pos.y + other.size.y ||
			this.pos.y + this.size.y <= other.pos.y
		);
	},

	// funkcja sprawdzajaca kolizje wokol jednostki
	getEntitiesAt: function (check, ignoreCrushable, ignoreNonBlocking) {

		/* Sprawdzenie pol wokol jednostki "5"
		**       ____________________
        |1|2|3|  |-1,_-1|0,_-1|1,_-1|
        |4|5|6|  |-1,_ 0|0,_ 0|1,_ 0|
        |7|8|9|  |-1,_ 1|0,_ 1|1,_ 1|
		**
        */

		var grid = this.getGridPos();
		var ts = this.tileSize;
		var cell = this.getNeighborCellPos(check);
		var x = cell.x;
		var y = cell.y;

		var n = ig.game.entities.length;
		var ents = [];
		for (var i = 0; i < n; i++) {
			var ent = ig.game.entities[i];
			if (ent === this || ent._killed) {
				continue;
			}
			if (ignoreCrushable && ent.crushable) {
				continue;
			}
			if (ignoreNonBlocking && ent.blocksEnemyPath === false) {
				continue;
			}

			var x0 = ent.pos.x;
			var x1 = x0 + ent.size.x;
			var y0 = ent.pos.y;
			var y1 = y0 + ent.size.y;

			if (x0 <= x && x1 > x && y0 <= y && y1 > y) {
				ents.push(ent);
			}
		}
		return ents;
	},

	spawnExplosion: function(type) {
		var grid = this.getGridPos();
		var ts = this.tileSize;

		for (var gridPos = 1; gridPos < 10; gridPos++) {
			var x, y;

			/* Sprawdzenie pol wokol jednostki "5"
			**       ____________________
	        |1|2|3|  |-1,_-1|0,_-1|1,_-1|
	        |4|5|6|  |-1,_ 0|0,_ 0|1,_ 0|
	        |7|8|9|  |-1,_ 1|0,_ 1|1,_ 1|
			**
	        */
			switch (gridPos) {
				case 1: x = grid.x - ts; y = grid.y - ts; break;
				case 2: x = grid.x;      y = grid.y - ts; break;
				case 3: x = grid.x + ts; y = grid.y - ts; break;

				case 4: x = grid.x - ts; y = grid.y;      break;
				case 5: x = grid.x;      y = grid.y;      break;
				case 6: x = grid.x + ts; y = grid.y;      break;

				case 7: x = grid.x - ts; y = grid.y + ts; break;
				case 8: x = grid.x;      y = grid.y + ts; break;
				case 9: x = grid.x + ts; y = grid.y + ts; break;

				default: x = grid.x; y = grid.y;
			}

			/* Dwa typy eksplozji, zalezne od parametru:
			** 
			** Typ 1: Standardowa eksplozje
			** Typ 2: Eksplozja pozostawiajaca Infotron
	        */
			switch (type) {
				case 1: var e = ig.game.spawnEntity(EntityExplosion, x, y); 		e.zIndex = -10;	break;
				case 2: var e = ig.game.spawnEntity(EntitySniksnak, x, y); 	e.zIndex = -10;	break;

				default: console.log("spawnExplosion: nie podano typu eksplozji");
			}

		    //console.log("gridPos XY: " + x + ", " + y + "gridPos: " + gridPos); //debug
		}

		// Funkcja sortująca ponownie tablice Entities
		ig.game.sortEntitiesDeferred();
	},

	update: function() {
		this.updateGridMovement();

		if (this._skipPhysicsMove) {
			if (this.currentAnim) {
				this.currentAnim.update();
			}
		}
		else {
			this.parent();
		}
	}


	/*handleMovementTrace: function (res) {
		if (res.collision.x || res.collision.y) {
			// This entity collided on either the x or y axis,
			// the collision pos is res.pos.x, res.pos.y.
			// Do whatever you want here.
			//console.log("Collision with wall"); //debug

			this.vel.x = 0;
			this.vel.y = 0;
			this.correctPosition();
		}
		this.parent(res);
	}*/

});

});