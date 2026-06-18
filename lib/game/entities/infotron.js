ig.module(
	'game.entities.infotron'
)
.requires(
	'impact.entity',
	'game.entities.my-movement'
)
.defines(function(){

EntityInfotron = EntityMyMovement.extend({

	_wmIgnore : false,
	size: {x: 32, y: 32},

	type: ig.Entity.TYPE.A, // Player unfriendly group
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,
	passable: true,

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	// tileSize: 32,
	// targetY: 0, // obliczane automatycznie na podstawie tileSize
	// targetX: 0, // obliczane automatycznie na podstawie tileSize
	// direction: null,
	// speed: 80,

	// wczytanie animacji base
	animSheet: new ig.AnimationSheet('media/infotron.png', 32, 32),

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.addAnim('idle', 1, [0]);
		this.addAnim('walkLeft', 0.1, [0,1,2,3,2,1]);
		this.addAnim('walkRight', 0.1, [4,5,6,7,6,5]);
		//this.addAnim('idle', 1, [39]);
		//this.addAnim('idle', 1, [39]);
		//this.addAnim('idle', 1, [39]);

	},


	check: function(other) {
		if (other instanceof EntityMurphy ) { //other instanceof EntityZonk && EntityZonk == this.falling 
        	this.kill(); // this.explosion();

        	ig.game.infotronCount++;

        	console.log("Infotron: zginalem! Kolekcja: " + ig.game.infotronCount);
    	}
		
	},

	 update: function() {
	 	//this.distanceTo( other ) > this.size.x/2 + other.size.x/2;

	 	//this.gotoGrid("left"); //if checkGrid == isEmpty;
	 	//this.currentAnim = this.anims.walkLeft;

	 	this.parent();
	 }

});

});