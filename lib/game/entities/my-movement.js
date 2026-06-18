ig.module(
	'game.entities.my-movement'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityMyMovement = ig.Entity.extend({

	_wmIgnore : false, // zapobiega wyswietlaniu jednostki w Welmeisterze
	size: {x: 32, y: 32}, // standardowy rozmiar pola

	type: ig.Entity.TYPE.B, // Player UNfriendly group
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	// Wlasne wlasciwosci
	tileSize: 32,
	targetY: 0, // obliczane automatycznie na podstawie tileSize
	targetX: 0, // obliczane automatycznie na podstawie tileSize
	direction: null, // kierunek w ktorym jednostka sie porusza
	speed: 100,

	falling: false, // okresla czy: jednostka moze spadac
	consumable: false, // okresla czy: jednostka moze byc zjedzona
	rounded: false, // okresla czy: inne jednoski moga sie przetaczac po danej jednostce
	pushable: false, // okresla czy jednostka moze byc przesuwana

	animSheet: new ig.AnimationSheet('media/infotron.png', 32, 32),

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.addAnim('idle', 1, [0]);

		this.correctPosition();
	},

	// wycentrowanie jednostki wzgledem siatki
	correctPosition: function () {
		xMod = this.pos.x.round() % 32;
		yMod = this.pos.y.round() % 32;
		this.pos.x = this.pos.x.round() - xMod;
		this.pos.y = this.pos.y.round() - yMod;
	},

	// funkcja poruszajaca jednostki
	gotoGrid: function (dirr) {
		if (this.vel.x == 0 && this.vel.y == 0) {

			// X/Y velocity (przyspieszenie) na 0 oznacza ze jednostka nie porusza sie wzgledem osi X/Y
			if (dirr == "up") {
				this.vel.y = -this.speed;
				this.vel.x = 0;
				this.targetY = this.pos.y.round() - this.tileSize;
				this.direction = "up";
			}
			else if (dirr == "down") {
				this.vel.y = this.speed;
				this.vel.x = 0;
				this.targetY = this.pos.y.round() + this.tileSize;
				this.direction = "down";

				//console.log("Jestem tutaj gotoGrid 3333!"); //debug
			}

			else if (dirr == "left") {
				this.vel.x = -this.speed;
				this.vel.y = 0;
				this.targetX = this.pos.x.round() - this.tileSize;
				this.direction = "left";
				//this.currentAnim = this.anims.walkLeft;
			}
			else if (dirr == "right") {
				this.vel.x = this.speed;
				this.vel.y = 0;
				this.targetX = this.pos.x.round() + this.tileSize;
				this.direction = "right";
				//this.currentAnim = this.anims.walkRight;
			}

			/*var awesomeVarNameX = (this.pos.x/32).round();
			var awesomeVarNameY = (this.pos.y/32).round();

			// Make sure that X & Y positions are always on whole numbers
			this.pos.x = awesomeVarNameX*32;
			this.pos.y = awesomeVarNameY*32;*/

			//console.log("Jestem tutaj gotoGrid 1111!"); //debug
		}
		else
		{
			// Test to see if we have reached the targetX or targetY and reset teh velocity.
			if (this.direction == "up" && this.pos.y.round() <= this.targetY) {
				this.vel.y = 0;
				this.correctPosition();
				//console.log("Jestem tutaj gotoGrid UPUP!"); //debug
			}
			else if (this.direction == "down" && this.pos.y.round() >= this.targetY) {
				this.vel.y = 0;
				this.correctPosition();
			}

			else if (this.direction == "left" && this.pos.x.round() <= this.targetX) {
				this.vel.x = 0;
				this.correctPosition();
				//this.currentAnim = this.anims.idle;
				//console.log("Jestem tutaj gotoGrid IDLEEE!"); //debug
			}
			else if (this.direction == "right" && this.pos.x.round() >= this.targetX) {
				this.vel.x = 0;
				this.correctPosition();
			}

			// Make sure that X & Y positions are always on whole numbers
			this.pos.x = this.pos.x.round();
			this.pos.y = this.pos.y.round();

			//console.log("this.vel.x: " + this.vel.x); //debug
			//console.log("this.vel.x: " + this.vel.y); //debug
			//console.log("Jestem tutaj gotoGrid 2222!"); //debug
		}


		//this.parent();
	},

	touches: function( other ) {		
		return !(
			this.pos.x >= other.pos.x + other.size.x ||
			this.pos.x + this.size.x <= other.pos.x ||
			this.pos.y >= other.pos.y + other.size.y ||
			this.pos.y + this.size.y <= other.pos.y
		);
	},

	// funkcja sprawdzajaca kolizje wokol jednostki
	getEntitiesAt: function(check) {

		/* Sprawdzenie pol wokol jednostki "5"
		**       ____________________
        |1|2|3|  |-1,_-1|0,_-1|1,_-1|
        |4|5|6|  |-1,_ 0|0,_ 0|1,_ 0|
        |7|8|9|  |-1,_ 1|0,_ 1|1,_ 1|
		**
        */

		switch (check) {
			case 1: x = this.pos.x.round() - 32; 	y = this.pos.y.round() - 32; break;
			case 2: x = this.pos.x.round(); 		y = this.pos.y.round() - 32; break;
			case 3: x = this.pos.x.round() + 32; 	y = this.pos.y.round() - 32; break;

			case 4: x = this.pos.x.round() - 32; 	y = this.pos.y.round(); 	 break;
			case 5: x = this.pos.x.round(); 		y = this.pos.y.round(); 	 break;
			case 6: x = this.pos.x.round() + 32; 	y = this.pos.y.round(); 	 break;

			case 7: x = this.pos.x.round() - 32; 	y = this.pos.y.round() + 32; break;
			case 8: x = this.pos.x.round(); 		y = this.pos.y.round() + 32; break;
			case 9: x = this.pos.x.round() + 32; 	y = this.pos.y.round() + 32; break;

			default: x = this.pos.x.round(); 		y = this.pos.y.round();
		}

		
		var n = ig.game.entities.length;
		var ents = [];
		for (var i = 0; i < n; i++)
		{
		    var ent = ig.game.entities[i],
		        x0 = ent.pos.x,
		        x1 = x0 + ent.size.x,
		        y0 = ent.pos.y,
		        y1 = y0 + ent.size.y;
		            
		    if (x0 <= x && x1 > x && y0 <= y && y1 > y)
		        ents.push(ent); //dodaje znaleziony obiekt do tablicy

		    //colsole.log(ent + " : " + ents[ent]); //debug
		}
		return ents;
	},

	spawnExplosion: function(type) {

		for(var gridPos = 1; gridPos < 10; gridPos++) {

			/* Sprawdzenie pol wokol jednostki "5"
			**       ____________________
	        |1|2|3|  |-1,_-1|0,_-1|1,_-1|
	        |4|5|6|  |-1,_ 0|0,_ 0|1,_ 0|
	        |7|8|9|  |-1,_ 1|0,_ 1|1,_ 1|
			**
	        */
			switch (gridPos) {
				case 1: x = this.pos.x.round() - 32; 	y = this.pos.y.round() - 32; break;
				case 2: x = this.pos.x.round(); 		y = this.pos.y.round() - 32; break;
				case 3: x = this.pos.x.round() + 32; 	y = this.pos.y.round() - 32; break;

				case 4: x = this.pos.x.round() - 32; 	y = this.pos.y.round(); 	 break;
				case 5: x = this.pos.x.round(); 		y = this.pos.y.round(); 	 break;
				case 6: x = this.pos.x.round() + 32; 	y = this.pos.y.round(); 	 break;

				case 7: x = this.pos.x.round() - 32; 	y = this.pos.y.round() + 32; break;
				case 8: x = this.pos.x.round(); 		y = this.pos.y.round() + 32; break;
				case 9: x = this.pos.x.round() + 32; 	y = this.pos.y.round() + 32; break;

				default: x = this.pos.x.round(); 		y = this.pos.y.round();
			}

			/* Dwa typy eksplozji, zalezne od parametru:
			** 
			** Typ 1: Standardowa eksplozje
			** Typ 2: Eksplozja pozostawiajaca Infotron
	        */
			switch (type) {
				case 1: var e = ig.game.spawnEntity(EntityExplosion, x, y); 		e.zIndex = -10;	break;
				case 2: var e = ig.game.spawnEntity(EntitySniksnak, x, y); 	e.zIndex = -10;	break;

				default: console.log("spawnExplosion: nie podano typu eksplozji");
			}

		    //console.log("gridPos XY: " + x + ", " + y + "gridPos: " + gridPos); //debug
		}

		// Funkcja sortująca ponownie tablice Entities
		ig.game.sortEntitiesDeferred();
	},

	//
	update: function() {
		/*
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
				this.currentAnim = this.anims.walkLeft;
			}
			else if (ig.input.state('right')) {
				this.vel.x = this.speed;
				this.vel.y = 0;
				this.targetX = this.pos.x.round() + this.tileSize;
				this.direction = "right";
				this.currentAnim = this.anims.walkRight;
			}
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

			//console.log("this.pos.x.round(): " + this.pos.x.round()); //debug
			//console.log("this.pos.y.round(): " + this.pos.y.round()); //debug
		}
		*/
		//this.gotoGrid("left");
		this.parent();
	}


	/*handleMovementTrace: function (res) {
		if (res.collision.x || res.collision.y) {
			// This entity collided on either the x or y axis,
			// the collision pos is res.pos.x, res.pos.y.
			// Do whatever you want here.
			//console.log("Collision with wall"); //debug

			this.vel.x = 0;
			this.vel.y = 0;
			this.correctPosition();
		}
		this.parent(res);
	}*/

});

});