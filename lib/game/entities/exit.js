ig.module(
	'game.entities.exit'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityExit = ig.Entity.extend({

	size: {x: 32, y: 32},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.FIXED,

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	// tileSize: 32,
	// targetY: 0, // obliczane automatycznie na podstawie tileSize
	// targetX: 0, // obliczane automatycznie na podstawie tileSize
	// direction: null,
	// speed: 80,

	// wczytanie animacji base
	animSheet: new ig.AnimationSheet('media/hardware.png', 32, 32),

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.addAnim('idle', 1, [15]);
		// this.addAnim('walkLeft', 0.1, [0,1,2,1,0]);
		// this.addAnim('walkRight', 0.1, [3,4,5,4,3]);
		//this.addAnim('idle', 1, [39]);
		//this.addAnim('idle', 1, [39]);
		//this.addAnim('idle', 1, [39]);
	},

	check: function(other) {
		if (other instanceof EntityExplosion) {
        	this.kill();

        	console.log("Exit: zginalem od EntityExplosion!");
    	}

		if (other instanceof EntityMurphy ) {

			if( this.level ) {
				
				var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function( m, l, a, b ) {
					return a.toUpperCase() + b;
				});
				
				ig.game.endLevel( ig.global['Level'+levelName] );
			}

        	console.log("Exit: zginalem od EntityMurphy!, LevelName: " + levelName);
    	}
	},
	
	update: function(){}

});

});