ig.module(
	'game.entities.base-danger'
)
.requires(
	'impact.entity',
	'game.entities.base'
)
.defines(function(){

EntityBaseDanger = EntityBase.extend({
	//Oznaczenie dodatkowym kolorem w WeltMeisterze
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 0, 0, 0.5)',

	dangerous: false,
	timer: null,
	randn: 0,

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.addAnim('idle', 1, [0]);
		this.addAnim('stand', 1, [0]);
		this.addAnim('buzz', 0.1, [8,9,10,11,12,11,12,11,10,9]);
		//this.addAnim('rand', 1, [0]);
		// this.addAnim('walkLeft', 0.1, [0,1,2,1,0]);
		// this.addAnim('walkRight', 0.1, [3,4,5,4,3]);
		//this.addAnim('idle', 1, [39]);
		//this.addAnim('idle', 1, [39]);
		//this.addAnim('idle', 1, [39]);
		this.timer = new ig.Timer(1);
	},

	check: function(other) {
		if (other instanceof EntityExplosion) {
        	this.kill();

        	console.log("Base-Danger: zginalem od EntityExplosion!");
    	}

		if (other instanceof EntityMurphy && !this.dangerous && other.isCollectingAt(this)) {
        	this.kill(); 

        	//console.log("Base: zginalem od EntityMurphy!");
    	}
	},

	update: function() {
		//this.timer.set(5);

		if  (this.timer.delta() < 0) {
			if (this.randn == 1) {
				this.currentAnim = this.anims.buzz;
				this.dangerous = true;
			}
			else
			{
				this.currentAnim = this.anims.stand;
				this.dangerous = false;
			}
			//console.log("Haha!:" + this.randn);
		}
		else
		{
			this.randn = Math.floor((Math.random()*16)+1);
			this.timer.reset();
			this.currentAnim = this.anims.stand;

			//console.log("Nie");
		}

		//console.log("Timer: " + this.timer.delta());
		//this.currentAnim = this.anims.idle;
		this.parent();
	}

});

});