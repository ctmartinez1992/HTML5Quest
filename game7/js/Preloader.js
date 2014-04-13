Game7.Preloader = function (game) {
	this.background = null;
};

Game7.Preloader.prototype = {
	preload: function () {	
        //Preload
        this.loadingText = this.add.text(this.world.centerX, this.world.centerY - ((this.world.height / 2) / 2), "Loading", { font: "36px Chunk", fill: "#ffffff", align: "center" });
        this.loadingText.anchor.setTo(0.5, 0.5);

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadBar);
		
		//Menu
        this.load.image('logo_hail', 'assets/menu_stuff/HAIL.png');
        this.load.image('logo_jump', 'assets/menu_stuff/JUMP.png');
        this.load.image('logo_smash', 'assets/menu_stuff/SMASH.png');
		
		//Sprite sheets
		this.load.spritesheet('player', 'assets/player.png', 56, 88);
		this.load.spritesheet('enemy', 'assets/enemy.png', 56, 88);
		
		//Images
		this.load.image('bg', 'assets/bg.png');
		this.load.image('ground', 'assets/ground.png');
		this.load.image('life', 'assets/life.png');
		this.load.image('icon_volume', 'assets/icon_volume.png');
		this.load.image('icon_volume_hover', 'assets/icon_volume_hover.png');
		this.load.image('green_hail', 'assets/green_hail.png');
		this.load.image('purple_hail', 'assets/purple_hail.png');
		
		//Audio
        this.load.audio('sound_goomba', 'assets/sounds/sound_goomba.wav');
        this.load.audio('sound_jump', 'assets/sounds/sound_jump.wav');
        this.load.audio('music', 'assets/sounds/music.mp3');
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
		Fade.fadeOut('MainMenu');
	}
};