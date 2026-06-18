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

			var xOverlap = minX < other.pos.x + other.size.x &&
				maxX > other.pos.x;
			var yOverlap = minY < other.pos.y + other.size.y &&
				maxY > other.pos.y;

			if (xOverlap && yOverlap) {
				other.check(this);
			}
		}
	},

	getMurphyInAdjacentCell: function () {
		for (var check = 2; check <= 8; check += 2) {
			var ents = this.getEntitiesAt(check);
			for (var i = 0; i < ents.length; i++) {
				if (ents[i] instanceof EntityMurphy) {
					return check;
				}
			}
		}
		return 0;
	},

	directionFromCell: function (check) {
		if (check === 2) { return 'up'; }
		if (check === 4) { return 'left'; }
		if (check === 6) { return 'right'; }
		if (check === 8) { return 'down'; }
		return null;
	},

	 update: function() {
	 	var choseMove = false;

	 	if (this.vel.x === 0 && this.vel.y === 0) {
	 		var murphyCell = this.getMurphyInAdjacentCell();
	 		if (murphyCell) {
	 			this.gotoGrid(this.directionFromCell(murphyCell));
	 			choseMove = true;
	 		}
	 	}

	 	if (!choseMove) {
	 	/**LEFT*************************************************/
		if (this.isCellOpenForPath(8) && this.direction == "left")
		{
			this.gotoGrid("down");
		}
		else if (this.isCellOpenForPath(4) && this.direction == "left")
		{
			this.gotoGrid("left");
		}
		else if (this.isCellOpenForPath(2) && this.direction == "left")
		{
			this.gotoGrid("up");
		}
		else if (this.isCellOpenForPath(6) && this.direction == "left")
		{
			this.gotoGrid("right");
		}

		/**DOWN*************************************************/
		else if (this.isCellOpenForPath(6) && this.direction == "down")
		{
			this.gotoGrid("right");
		}
		else if (this.isCellOpenForPath(8) && this.direction == "down")
		{
			this.gotoGrid("down");
		}
		else if (this.isCellOpenForPath(4) && this.direction == "down")
		{
			this.gotoGrid("left");
		}
		else if (this.isCellOpenForPath(2) && this.direction == "down")
		{
			this.gotoGrid("up");
		}

		/**RIGHT************************************************/
		else if (this.isCellOpenForPath(2) && this.direction == "right")
		{
			this.gotoGrid("up");
		}
		else if (this.isCellOpenForPath(6) && this.direction == "right")
		{
			this.gotoGrid("right");
		}
		else if (this.isCellOpenForPath(8) && this.direction == "right")
		{
			this.gotoGrid("down");
		}
		else if (this.isCellOpenForPath(4) && this.direction == "right")
		{
			this.gotoGrid("left");
		}
			
		/**UP***************************************************/
		else if (this.isCellOpenForPath(4) && this.direction == "up")
		{
			this.gotoGrid("left");
		}
		else if (this.isCellOpenForPath(2) && this.direction == "up")
		{
			this.gotoGrid("up");
		}
		else if (this.isCellOpenForPath(6) && this.direction == "up")
		{
			this.gotoGrid("right");
		}
		else if (this.isCellOpenForPath(8) && this.direction == "up")
		{
			this.gotoGrid("down");
		}

		/*******************************************************/

		/*else if (!this.getEntitiesAt(2).length > 0 &&
				 !this.getEntitiesAt(4).length > 0 &&
				 !this.getEntitiesAt(6).length > 0 &&
				 !this.getEntitiesAt(8).length > 0)
		{
			this.direction == "O";
		}*/

		else if (!this.direction)
		{
			this.gotoGrid("left");
			//console.log("TUUUUUUUUU!!");
		}
		////////////////////////////////////////

		else
		{
			//this.gotoGrid("left");
			//console.log(this.getEntitiesAt(8));
		}
		//}

	 	} // end if (!choseMove)

		if (this.direction == "up")
		{
			this.currentAnim = this.anims.walkUp;
		}
		else if (this.direction == "down")
		{
			this.currentAnim = this.anims.walkDown;
		}
		else if (this.direction == "left")
		{
			this.currentAnim = this.anims.walkLeft;
		}
		else if (this.direction == "right")
		{
			this.currentAnim = this.anims.walkRight;
		}
		/*else if (this.direction == "O")
		{
			this.currentAnim = this.anims.walkO;
		}*/
	 	
	 	//this.gotoGrid("left"); //if checkGrid == isEmpty;
	 	//this.currentAnim = this.anims.walkLeft;

	 	this.checkMurphyContact();
	 	this.parent();
	 	this.checkMurphyContact();
	 }

});

});