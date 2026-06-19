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

	gravitable: true,
	rounded: true,
	supportsObjects: true,
	pushable: true,

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

	update: function() {
		this.falling = this.vel.y > 0;
		this.collides = this.vel.y > 0 ?
			ig.Entity.COLLIDES.LITE : ig.Entity.COLLIDES.FIXED;

		if (this.vel.x < 0) {
			this.currentAnim = this.anims.walkLeft;
		}
		else if (this.vel.x > 0) {
			this.currentAnim = this.anims.walkRight;
		}
		else {
			this.currentAnim = this.anims.idle;
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