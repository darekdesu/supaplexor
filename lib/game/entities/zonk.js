ig.module(
	'game.entities.zonk'
)
.requires(
	'impact.entity',
	'game.entities.my-movement'
)
.defines(function(){

EntityZonk = EntityMyMovement.extend({

	_wmIgnore : false,
	size: {x: 32, y: 32},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.FIXED,

	dropableLeft: false,
	dropableRight: false,
	rEnemy: false,

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	// tileSize: 32,
	// targetY: 0, // obliczane automatycznie na podstawie tileSize
	// targetX: 0, // obliczane automatycznie na podstawie tileSize
	// direction: null,
	// speed: 80,

	// wczytanie animacji base
	animSheet: new ig.AnimationSheet('media/zonk.png', 32, 32),

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.addAnim('idle', 1, [0]);
		this.addAnim('walkLeft', 0.1, [0,3,2,1,0]);
		this.addAnim('walkRight', 0.1, [0,1,2,3,0]);
		//this.addAnim('idle', 1, [39]);
		//this.addAnim('idle', 1, [39]);
		//this.addAnim('idle', 1, [39]);

	},


	// collideWith: function(other,axis) {} //do podmiany!

	check: function(other) {
		if (other instanceof EntityBaseDanger && other.dangerous ) { //other instanceof EntityZonk && EntityZonk == this.falling 
        	this.kill(); // this.explosion();

        	console.log("Zonk: zginalem od EntityBaseDanger!");
    	}


    	/*if (other instanceof EntityZonk && this.dropableLeft) { //other instanceof EntityZonk && EntityZonk == this.falling 
        	this.gotoGrid("left");

        	console.log("Zonk: Czy przesuwam sie!");
    	}*/
		
	},

	checkFallCollisions: function () {
		if (this.vel.y <= 0) {
			return;
		}

		var tick = ig.system.tick;
		var moveY = this.vel.y * tick;
		var rockBottom = this.pos.y + this.size.y + moveY;

		for (var i = 0; i < ig.game.entities.length; i++) {
			var other = ig.game.entities[i];
			if (other === this || other._killed || !other.crushable) {
				continue;
			}

			var xOverlap = this.pos.x < other.pos.x + other.size.x &&
				this.pos.x + this.size.x > other.pos.x;

			if (!xOverlap || rockBottom <= other.pos.y) {
				continue;
			}

			if (other instanceof EntityMurphy) {
				other.check(this);
			}
			else {
				other.kill();
			}
		}
	},

	update: function() {
		this.falling = this.vel.y > 0;

		if (this.vel.y > 0) {
			this.collides = ig.Entity.COLLIDES.LITE;
		}
		else {
			this.collides = ig.Entity.COLLIDES.FIXED;
		}

		// Zonk: jesli pole na 4 i 7 jest puste przesun sie w lewo
		if (!this.isCellOccupied(4) && !this.isCellOccupied(7) && this.vel.y === 0) {
			this.dropableLeft = true;
		}
		else {
			this.dropableLeft = false;
		}

		if (!this.isCellOccupied(6) && !this.isCellOccupied(9) && this.vel.y === 0) {
			this.dropableRight = true;
		}
		else {
			this.dropableRight = false;
		}

		if (this.vel.y > 0) {
			this.checkFallCollisions();
		}

		this.parent();

		if (this.vel.y > 0) {
			this.checkFallCollisions();
		}
	 }

});

});