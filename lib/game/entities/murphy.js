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
	collides: ig.Entity.COLLIDES.NEVER,
	crushable: true,
	blocksEnemyPath: false,
	supportsObjects: true,
	speed: 140,
	maxVel: { x: 160, y: 160 },

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
		this._deathNotified = false;

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

	kill: function(skipExplosion) {
		if (!this._deathNotified) {
			this._deathNotified = true;
			if (!skipExplosion) {
				var grid = this.getGridPos();
				var explosion = ig.game.spawnEntity(EntityExplosion, grid.x, grid.y);
				explosion.zIndex = -10;
			}
			ig.game.scheduleDeathScreen(this.getGridPos());
		}
		this.parent();
	},

	check: function(other) {
		if (other instanceof EntityExplosion) {
        	this.kill(true);

        	console.log("Murphy: zginalem od EntityExplosion!");
    	}

		if (other instanceof EntitySniksnak) {
			if (this.vel.x !== 0 || this.vel.y !== 0) {
				return;
			}
			if (!other.isMovingTowardMurphy || !other.isMovingTowardMurphy(this)) {
				return;
			}
        	this.spawnExplosion(1);
        	this.kill(true);

        	console.log("Murphy: dotknalem Snicksnack, eksplozja!");
    	}

    	/*if (other instanceof EntityInfotron) {
        	this.kill();

        	console.log("Murphy: zginalem od Infotronu!");
    	}*/

    	if (other instanceof EntityZonk && other.vel.y > 0) {
        	this.kill();
    	}

    	if (other instanceof EntityBaseDanger && other.dangerous) {
        	this.spawnExplosion(1);
        	this.kill(true);

        	console.log("Murphy: zginalem od EntityBaseDanger!");
    	}
		
	},

	update: function() {

		if (this.vel.x === 0 && this.vel.y === 0) {

			if (ig.input.state('up') && this.canMoveInDirection('up')) {
				this.startGridMove('up');
			}
			else if (ig.input.state('down') && this.canMoveInDirection('down')) {
				this.startGridMove('down');
			}

			if (ig.input.state('left') && this.canMoveInDirection('left')) {
				this.startGridMove('left');
			}
			else if (ig.input.state('right') && this.canMoveInDirection('right')) {
				this.startGridMove('right');
			}
			else if (ig.input.state('plus')) {
				this.spawnExplosion(1);
			}

			var grid = this.getGridPos();
			this.pos.x = grid.x;
			this.pos.y = grid.y;
		}

		// set the current animation, based on the player's speed
		if (this.vel.y < 0) {
			this.currentAnim = this.anims.walkRight;
		}
		else if (this.vel.y > 0) {
			this.currentAnim = this.anims.walkLeft;
		}
		else if (this.vel.x > 0) {
			this.currentAnim = this.anims.walkRight;
		}
		else if (this.vel.x < 0) {
			this.currentAnim = this.anims.walkLeft;
		}
		else {
			this.currentAnim = this.anims.idle;
		}

		this.parent();
	}

});

});