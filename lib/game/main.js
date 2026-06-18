ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	// 'impact.debug.debug', //debug

	'game.entities.my-movement',
	'game.entities.murphy',

	'game.entities.sniksnak',
	'game.entities.infotron',
	'game.entities.zonk',

	'game.entities.exit',
	'game.entities.base',
	'game.entities.base-danger',

	'game.entities.explosion',

	'game.levels.supaplex1',
	'game.levels.supaplex2',
	'game.levels.supaplex3'
)
.defines(function(){

SupaplexGame = ig.Game.extend({
	font: new ig.Font( 'media/prime.png' ),
    clearColor: '#0d0c0b',

    player: null,
    mode: 0,

    lastCheckpoint: null,
    nextLevel: null,

    playerSpawnPos: {
        x: 0,
        y: 0
    },

    deathCount: 0,
    infotronCount: 0,
    infotronTotal: 0,
    levelTime: null,
    levelTimeText: '0',

    lastTick: 0.016,
    realTime: 0,
    showFPS: false,

	//infotronCount: 0,
	//infotronTotal: 0,

	correctPosition: function () {
		xMod = this.pos.x.round() % 32;
		yMod = this.pos.y.round() % 32;
		this.pos.x = this.pos.x.round() - xMod;
		this.pos.y = this.pos.y.round() - yMod;
	},
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind (ig.KEY.UP_ARROW, 'up');
		ig.input.bind (ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind (ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind (ig.KEY.RIGHT_ARROW, 'right');

		ig.input.bind (ig.KEY.ENTER, 'enter');
		ig.input.bind (ig.KEY.BACKSPACE, 'plus');

		
		this.loadLevel(LevelSupaplex1);
		this.realTime = Date.now();
        this.lastTick = 0.016;
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		

		// screen follows the player
			var player = this.getEntitiesByType(EntityMurphy)[0];
			if (player) {
				this.screen.x = player.pos.x - ig.system.width / 2;
				this.screen.y = player.pos.y - ig.system.height / 2;
			}
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Add your own drawing code here
		// var x = ig.system.width/2,
		// 	y = ig.system.height/2;
		
        //Statystyki Infotrony / Czas
		this.font.draw( 'Infotrony:', 545, 450, ig.Font.ALIGN.RIGHT );
        this.font.draw( this.infotronCount + ' / ' + this.infotronTotal, 555, 450, ig.Font.ALIGN.LEFT );
        this.font.draw( 'Czas: ', 545, 430, ig.Font.ALIGN.RIGHT );
        this.font.draw( this.levelTime.delta().round(1).toString() + 's', 555, 430, ig.Font.ALIGN.LEFT );
	},


    loadLevel: function (level) {
        this.parent(level);
        this.player = this.getEntitiesByType(EntityMurphy)[0];
        // this.lastCheckpoint = null;
        this.playerSpawnPos = {
            x: this.player.pos.x,
            y: this.player.pos.y
        };

        this.deathCount = 0;
        this.infotronCount = 0;
        this.infotronTotal = this.getEntitiesByType(EntityInfotron).length; // zlicza ilosc Infotronow na planszy

        this.levelTime = new ig.Timer();

        this.mode = SupaplexGame.MODE.GAME;

        /*this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
        this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;

        this.camera.set(this.player);
        if (ig.ua.mobile) {
            for (var i = 0; i < this.backgroundMaps.length; i++) {
                this.backgroundMaps[i].preRender = true;
            }
        }*/
    },
    endLevel: function (nextLevel) {
        this.nextLevel = nextLevel;
        this.levelTimeText = this.levelTime.delta().round(2).toString();
        this.mode = SupaplexGame.MODE.STATS;




        console.log("endLevel - NextLevel: " + this.nextLevel );
    },

    /*end: function () {
        ig.system.setGame(BiolabCredits); //koniec gry, napisy koncowe
    },*/

    respawnPlayerAtLastCheckpoint: function (x, y) {
        /*if (this.lastCheckpoint) {
            pos = this.lastCheckpoint.getSpawnPos()
            this.lastCheckpoint.currentAnim = this.lastCheckpoint.anims.respawn.rewind();
        }*/
        var pos = this.playerSpawnPos; //wczytanie wspolrzednych poczatkowych gracza
        this.player = this.spawnEntity(EntityMurphy, pos.x, pos.y); // przywolanie gracza na poczatkowych wspolrzednych
        //this.player.currentAnim = this.player.anims.spawn; // animacja przywolania
        this.deathCount++;

        console.log('respawnPlayerAtLastCheckpoint: tutaj!');
    },

    /*showDeath: function () {
            if (ig.input.pressed('up')) {
                this.loadLevel(this.nextLevel);
                return;
            }

            ig.system.clear(this.clearColor);
            this.font.draw('Poziom ukonczony!', ig.system.width / 2, 80, ig.Font.ALIGN.CENTER);
            this.font.draw('Czas:', 111, 140, ig.Font.ALIGN.RIGHT);
            this.font.draw(this.levelTimeText + 's', 151, 140);
            this.font.draw('Infotrony:', 111, 172, ig.Font.ALIGN.RIGHT);
            this.font.draw(this.infotronCount + '/' + this.infotronTotal, 151, 172);
            this.font.draw('Zgony:', 111, 204, ig.Font.ALIGN.RIGHT);
            this.font.draw(this.deathCount.toString(), 151, 204);
            this.font.draw('Nacisnij przycisk GORA,\naby kontynuowac.', ig.system.width / 2, 360, ig.Font.ALIGN.CENTER);
    },*/

    run: function () {
        var now = Date.now();
        this.lastTick = this.lastTick * 0.9 + ((now - this.realTime) / 1000) * 0.1;
        this.realTime = now;
        /*if (ig.input.pressed('fps')) {
            this.showFPS = !this.showFPS;
        }*/
        if (this.mode == SupaplexGame.MODE.GAME) {
            this.update();
            this.draw();
        } else if (this.mode == SupaplexGame.MODE.STATS) {
            this.showStats();
        } else if (this.mode == SupaplexGame.MODE.STATS2) {
            this.showStatsKill();
        }
    },

	showStats: function () {
        if (ig.input.pressed('enter')) {
            this.loadLevel(this.nextLevel);
            return;
        }

        ig.system.clear(this.clearColor);
        this.font.draw('Poziom ukonczony!', ig.system.width / 2, 80, ig.Font.ALIGN.CENTER);
        this.font.draw('Czas:', 111, 140, ig.Font.ALIGN.RIGHT);
        this.font.draw(this.levelTimeText + 's', 151, 140);
        this.font.draw('Infotrony:', 111, 172, ig.Font.ALIGN.RIGHT);
        this.font.draw(this.infotronCount + '/' + this.infotronTotal, 151, 172);
        this.font.draw('Zgony:', 111, 204, ig.Font.ALIGN.RIGHT);
        this.font.draw(this.deathCount.toString(), 151, 204);
        this.font.draw('Nacisnij ENTER,\naby kontynuowac.', ig.system.width / 2, 360, ig.Font.ALIGN.CENTER);
    },

    showStatsKill: function () {
        if (ig.input.pressed('enter')) {
            this.loadLevel(this.level);
            return;
        }

        ig.system.clear(this.clearColor);
        this.font.draw('Zginales!', ig.system.width / 2, 80, ig.Font.ALIGN.CENTER);
        this.font.draw('Kliknij START,\naby kontynuowac.', ig.system.width / 2, 360, ig.Font.ALIGN.CENTER);

        console.log('showStatsKill: tutaj!');
    },

    PlayerKilled: function () {
        this.player = this.getEntitiesByType(EntityMurphy)[0];
        this.player.kill();

        this.mode = SupaplexGame.MODE.STATS2;

        console.log('PlayerKilled: tutaj!');
    }
});

    SupaplexGame.MODE = {
        GAME: 1,
        STATS: 2
    };


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 1
ig.main( '#canvas', SupaplexGame, 60, 640, 480, 1 );

});
