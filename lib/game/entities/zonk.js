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

	update: function() {
		// Zonk: jesli jest w ruchu to zmien model kolizji
		if (this.vel.y > 0) {
			this.collides = ig.Entity.COLLIDES.LITE;
			//console.log("Zonk: Bylem tu?");
		}
		else
		{
			this.collides = ig.Entity.COLLIDES.FIXED;
			//console.log("Zonk: NIE!!!");
		}

	 	// Zonk: jesli pole ponizej jest puste to przesun sie w dol
		if (!this.getEntitiesAt(8).length > 0 && this.vel.y == 0) {
			this.gotoGrid("down");
		}


		// Zonk: jesli pole na 4 i 7 jest puste przesun sie w lewo
		if (!this.getEntitiesAt(4).length > 0 && !this.getEntitiesAt(7).length > 0 && this.vel.y == 0) {
			this.dropableLeft = true;

			//this.gotoGrid("left");
			//this.gotoGrid("down");

			//console.log("Zonk: Mam pusto po lewej!");
		}
		else
		{
			this.dropableLeft = false;
		}

		if (!this.getEntitiesAt(6).length > 0 && !this.getEntitiesAt(9).length > 0 && this.vel.y == 0) {
			this.dropableRight = true;

		}
		else
		{
			this.dropableRight = false;
		}




	
	 	
	 	//this.gotoGrid("left"); //if checkGrid == isEmpty;
	 	//this.currentAnim = this.anims.walkLeft;

	 	this.parent();
	 }

});

});