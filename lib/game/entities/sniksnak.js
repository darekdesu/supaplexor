ig.module(
	'game.entities.sniksnak'
)
.requires(
	'impact.entity',
	'game.entities.my-movement'
)
.defines(function(){

EntitySniksnak = EntityMyMovement.extend({

	_wmIgnore : false,
	size: {x: 32, y: 32},

	type: ig.Entity.TYPE.B, // Player unfriendly group
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.LITE,
	crushable: true,

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	// tileSize: 32,
	// targetY: 0, // obliczane automatycznie na podstawie tileSize
	// targetX: 0, // obliczane automatycznie na podstawie tileSize
	// direction: null,
	// speed: 80,

	// wczytanie animacji base
	animSheet: new ig.AnimationSheet('media/snik-snak.png', 32, 32),

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.addAnim('idle', 1, [0]);
		this.addAnim('walkLeft', 0.1, [0,1,2,3,2,1]);
		this.addAnim('walkRight', 0.1, [4,5,6,7,6,5]);
		this.addAnim('walkUp', 0.1, [8,9,10,11,10,9]);
		this.addAnim('walkDown', 0.1, [12,13,14,15,14,13]);
		this.addAnim('walkO', 0.1, [0,17,12,18,4,19,8,16]);
		//this.addAnim('idle', 1, [39]);
		//this.addAnim('idle', 1, [39]);
		//this.addAnim('idle', 1, [39]);

	},


	check: function(other) {
		if (other instanceof EntityExplosion) {
			this.spawnExplosion(1);
        	this.kill();

        	console.log("Murphy: zginalem od EntityExplosion!");
    	}

		if (other instanceof EntityBaseDanger && other.dangerous ) { //other instanceof EntityZonk && EntityZonk == this.falling 
        	this.spawnExplosion(1);
        	this.kill(); // this.explosion();

        	console.log("Sniksnak: zginalem od EntityBaseDanger!");
    	}

    	if (other instanceof EntityZonk && other.vel.y > 0 ) { //other instanceof EntityZonk && EntityZonk == this.falling 
        	this.kill(); // this.explosion();

        	console.log("Snicksnack: zginalem od EntityZonk!");
    	}
		
	},

	checkMurphyContact: function () {
		if (this.vel.x === 0 && this.vel.y === 0) {
			return;
		}

		var tick = ig.system.tick;
		var minX = this.pos.x;
		var maxX = this.pos.x + this.size.x;
		var minY = this.pos.y;
		var maxY = this.pos.y + this.size.y;

		if (this.vel.x) {
			var moveX = this.vel.x * tick;
			minX = Math.min(this.pos.x, this.pos.x + moveX);
			maxX = Math.max(this.pos.x + this.size.x, this.pos.x + moveX + this.size.x);
		}
		if (this.vel.y) {
			var moveY = this.vel.y * tick;
			minY = Math.min(this.pos.y, this.pos.y + moveY);
			maxY = Math.max(this.pos.y + this.size.y, this.pos.y + moveY + this.size.y);
		}

		for (var i = 0; i < ig.game.entities.length; i++) {
			var other = ig.game.entities[i];
			if (!(other instanceof EntityMurphy) || other._killed) {
				continue;
			}

			if (!this.isMovingTowardMurphy(other)) {
				continue;
			}

			var xOverlap = minX < other.pos.x + other.size.x &&
				maxX > other.pos.x;
			var yOverlap = minY < other.pos.y + other.size.y &&
				maxY > other.pos.y;

			if (xOverlap && yOverlap) {
				other.check(this);
			}
		}
	},

	isMovingTowardMurphy: function (murphy) {
		var grid = murphy.getGridPos();
		return this.targetX === grid.x && this.targetY === grid.y;
	},

	turnLeft: function (dir) {
		return { up: 'left', left: 'down', down: 'right', right: 'up' }[dir];
	},

	turnRight: function (dir) {
		return { up: 'right', right: 'down', down: 'left', left: 'up' }[dir];
	},

	turnAround: function (dir) {
		return { up: 'down', down: 'up', left: 'right', right: 'left' }[dir];
	},

	isMurphyLeavingCellAt: function (check) {
		var cell = this.getNeighborCellPos(check);
		var ents = this.getEntitiesAt(check);

		for (var i = 0; i < ents.length; i++) {
			var ent = ents[i];
			if (!(ent instanceof EntityMurphy) || ent._killed) {
				continue;
			}
			if (ent.vel.x === 0 && ent.vel.y === 0) {
				continue;
			}

			var grid = ent.getGridPos();
			if (grid.x === cell.x && grid.y === cell.y &&
				(ent.targetX !== cell.x || ent.targetY !== cell.y)) {
				return true;
			}
		}

		return false;
	},

	isCellEnterableForSniksnak: function (check) {
		if (!this.canStepToCell(check)) {
			return false;
		}
		if (this.isMurphyLeavingCellAt(check)) {
			return false;
		}
		return this.isCellOpenForPath(check);
	},

	pickDirection: function () {
		var facing = this.direction || 'left';
		var candidates = [
			this.turnLeft(facing),
			facing,
			this.turnRight(facing),
			this.turnAround(facing)
		];

		for (var i = 0; i < candidates.length; i++) {
			var dir = candidates[i];
			var check = this.getDirectionCell(dir);

			if (this.isCellEnterableForSniksnak(check)) {
				return dir;
			}
		}

		return null;
	},

	 update: function() {
	 	var locked = false;

	 	if (this.vel.x === 0 && this.vel.y === 0) {
	 		var dir = this.pickDirection();
	 		if (dir) {
	 			this.gotoGrid(dir);
	 		} else {
	 			locked = true;
	 		}
	 	}

		if (locked) {
			this.currentAnim = this.anims.walkO;
		}
		else if (this.direction == "up") {
			this.currentAnim = this.anims.walkUp;
		}
		else if (this.direction == "down") {
			this.currentAnim = this.anims.walkDown;
		}
		else if (this.direction == "left") {
			this.currentAnim = this.anims.walkLeft;
		}
		else if (this.direction == "right") {
			this.currentAnim = this.anims.walkRight;
		}

	 	this.checkMurphyContact();
	 	this.parent();
	 	this.checkMurphyContact();
	 }

});

});