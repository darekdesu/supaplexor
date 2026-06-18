ig.module(
	'game.entities.murphy'
)
.requires(
	'impact.entity',
	'game.entities.my-movement'
)
.defines(function(){

EntityMurphy = EntityMyMovement.extend({

	size: {x: 32, y: 32},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.PASSIVE,

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	/*tileSize: 32,
	targetY: 0, // obliczane automatycznie na podstawie tileSize
	targetX: 0, // obliczane automatycznie na podstawie tileSize
	direction: null,
	speed: 80,*/

	// wczytanie animacji gracza
	animSheet: new ig.AnimationSheet('media/murphy.png', 32, 32),

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.addAnim('idle', 1, [39]);
		this.addAnim('walkLeft', 0.1, [0,1,2,1,0]);
		this.addAnim('walkRight', 0.1, [3,4,5,4,3]);
		//this.addAnim('idle', 1, [39]);
		//this.addAnim('idle', 1, [39]);
		//this.addAnim('idle', 1, [39]);

		this.correctPosition();
	},

	 /**
	* This makes sure the player is always correctly centered in a tile.
	*/
/*	correctPosition: function () {
		xMod = this.pos.x.round() % 32;
		yMod = this.pos.y.round() % 32;
		this.pos.x = this.pos.x.round() - xMod;
		this.pos.y = this.pos.y.round() - yMod;
	},*/

/*	update: function() {
	    // This method is called for every frame on each entity.
	    // React to input, or compute the entity's AI here.

	    if( ig.input.pressed('up') ) {
	        this.vel.y = -100;
	    }
	    else if( ig.input.pressed('down') ) {
	    	this.vel.y = 100;
	    }

	    if( ig.input.pressed('left') ) {
	        this.vel.x = -100;
	    }
	    else if( ig.input.pressed('right') ) {
	    	this.vel.x = 100;
	    }
	    // Call the parent update() method to move the entity
	    // according to its physics
	    this.parent(); 
	}*/

	check: function(other) {
		if (other instanceof EntityExplosion) {
        	this.kill();

        	console.log("Murphy: zginalem od EntityExplosion!");
    	}

		if (other instanceof EntitySniksnak) {
        	this.spawnExplosion(1);
        	this.kill();
        	
        	//ig.game.PlayerKilled();



        	console.log("Murphy: dotknalem Snicksnack, eksplozja!");
    	}

    	/*if (other instanceof EntityInfotron) {
        	this.kill();

        	console.log("Murphy: zginalem od Infotronu!");
    	}*/

    	if (other instanceof EntityZonk) {
        	//this.kill();

        	console.log("Murphy: zginalem od Zonka!");
    	}

    	if (other instanceof EntityBaseDanger && other.dangerous) {
        	this.spawnExplosion(1);
        	this.kill();

        	console.log("Murphy: zginalem od EntityBaseDanger!");
    	}
		
	},

	update: function() {

		/*if (this.vel.x == 0 && this.vel.y == 0) {
			if (this.getEntitiesAt(1).length > 0) {
				console.log("topLeft: cos tam jest!!");
			}
			else
			{
				//console.log("topLeft: NIC NIE MA!!");
			}
		}*/


			//this.checkGrid("up");
			//console.log("CheckGridUP: " + this.checkGrid("up"));

		if (this.vel.x == 0 && this.vel.y == 0) {

			// If X and Y velocity is at 0 the player isn't moving
			if (ig.input.state('up')) {
				this.vel.y = -this.speed;
				this.vel.x = 0;
				this.targetY = this.pos.y.round() - this.tileSize;
				this.direction = "up";
			}
			else if (ig.input.state('down')) {
				this.vel.y = this.speed;
				this.vel.x = 0;
				this.targetY = this.pos.y.round() + this.tileSize;
				this.direction = "down";
			}

			if (ig.input.state('left')) {
				this.vel.x = -this.speed;
				this.vel.y = 0;
				this.targetX = this.pos.x.round() - this.tileSize;
				this.direction = "left";
				//this.currentAnim = this.anims.walkLeft;
			}
			else if (ig.input.state('right')) {
				this.vel.x = this.speed;
				this.vel.y = 0;
				this.targetX = this.pos.x.round() + this.tileSize;
				this.direction = "right";
				//this.currentAnim = this.anims.walkRight;
			}

			/*else if (ig.input.state('enter')) {
				console.log("this.pos.x.round(): " + this.pos.x.round());
				console.log("this.pos.y.round(): " + this.pos.y.round());
			}*/

			else if (ig.input.state('plus')) {

				console.log("Nacisnieto: PLUS");
				this.spawnExplosion(1);
			}
			
			// wymusza wycentrowanie jednostki jesli X,Y vel=0; 
			var awesomeVarNameX = (this.pos.x/32).round();
			var awesomeVarNameY = (this.pos.y/32).round();

			this.pos.x = awesomeVarNameX*32;
			this.pos.y = awesomeVarNameY*32;
			
		}
		else
		{
			// Test to see if we have reached the targetX or targetY and reset teh velocity.
			if (this.direction == "up" && this.pos.y.round() <= this.targetY) {
				this.vel.y = 0;
				this.correctPosition();
			}
			else if (this.direction == "down" && this.pos.y.round() >= this.targetY) {
				this.vel.y = 0;
				this.correctPosition();
			}
			else if (this.direction == "left" && this.pos.x.round() <= this.targetX) {
				this.vel.x = 0;
				this.correctPosition();
			}
			else if (this.direction == "right" && this.pos.x.round() >= this.targetX) {
				this.vel.x = 0;
				this.correctPosition();
			}

			// Make sure that X & Y positions are always on whole numbers
			this.pos.x = this.pos.x.round();
			this.pos.y = this.pos.y.round();

			/*
			var awesomeVarNameX = (this.pos.x/32).round();
			var awesomeVarNameY = (this.pos.y/32).round();

			// Make sure that X & Y positions are always on whole numbers
			this.pos.x = awesomeVarNameX*32;
			this.pos.y = awesomeVarNameY*32;
			*/

			/*console.log("this.pos.x.round(): " + this.pos.x.round());
			console.log("this.pos.y.round(): " + this.pos.y.round());*/
		}

		// set the current animation, based on the player's speed !!!!!!!!!!!!!!!!!!
		if( this.vel.y < 0 )
		{
			this.currentAnim = this.anims.walkRight;
		}
		else if( this.vel.y > 0 )
		{
			this.currentAnim = this.anims.walkLeft;
		}
		else if( this.vel.x > 0 )
		{
			this.currentAnim = this.anims.walkRight;
		}
		else if( this.vel.x < 0 )
		{
			this.currentAnim = this.anims.walkLeft;
		}
		else
		{
			this.currentAnim = this.anims.idle;
		}

		this.parent();
	}

});

});