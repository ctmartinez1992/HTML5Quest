Game5.Preloader = function (game) {
	this.background = null;
};

Game5.Preloader.prototype = {
	preload: function () {	
        //Preload bar and Loading text
        this.loadingText = this.add.text(this.world.centerX, this.world.centerY - ((this.world.height / 2) / 2), "Loading", { font: "36px Chunk", fill: "#ffffff", align: "center" });
        this.loadingText.anchor.setTo(0.5, 0.5);

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadBar);
		
		//Assets
        this.load.spritesheet('bird', 'assets/bird.png', 34, 24, 4);
		
        this.load.image('ground', 'assets/ground.png');
        this.load.image('tube', 'assets/tube.png');
        this.load.image('tubetop', 'assets/tube_top.png');
		
        this.load.audio('jump', 'assets/sounds/jump.wav');
        this.load.audio('explosion', 'assets/sounds/explosion.wav');
	},

	create: function () {
        //Draw loaded text
		this.loadingText.content = "Loaded";
        this.loadingText.anchor.setTo(0.5, 0.5);

        this.add.tween(this.loadingText).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.In, true);
        this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.In, true);
		var tween = this.add.tween(this.preloadBar).to({ y: (this.game.canvas.height / 2) }, 1000, Phaser.Easing.Exponential.In, true);

		tween.onComplete.add(this.startLevel, this);
	},

	startLevel: function () {
		this.game.state.start('MainMenu', true, false);
	}
};