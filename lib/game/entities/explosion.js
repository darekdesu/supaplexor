ig.module(
	'game.entities.explosion'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityExplosion = ig.Entity.extend({

	size: {x: 32, y: 32},

	type: ig.Entity.TYPE.B, // Player friendly group
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.NEVER,

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	// tileSize: 32,
	// targetY: 0, // obliczane automatycznie na podstawie tileSize
	// targetX: 0, // obliczane automatycznie na podstawie tileSize
	// direction: null,
	// speed: 80,

	// wczytanie animacji base
	animSheet: new ig.AnimationSheet('media/explosion.png', 32, 32),

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.addAnim('idle', 1, [7]);
		this.addAnim('boom', 0.1, [0,1,2,3,4,5,6,7]);

		this.timer = new ig.Timer(0.8);
	},


	check: function(other) {
		if (other instanceof EntityMurphy ) {
        	//this.kill(); 

        	//console.log("Explosion: zginalem od EntityMurphy!"); debug
    	}
	},

	 update: function() {
	 	if  (this.timer.delta() < 0) {
	 		this.currentAnim = this.anims.boom;

	 		//console.log("Explosion: czas minal: " + this.timer.delta()); //debug
	 	}
	 	else {
	 		this.currentAnim = this.anims.idle;
	 		this.kill(); 

	 	}

	 	this.parent();
	 }

});

});