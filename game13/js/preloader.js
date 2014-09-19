Game13.Preloader = function (game) {
	this.background = null;
};

Game13.Preloader.prototype = {
	preload: function () {	
        //Preload
        this.loadingText = this.add.text(this.world.centerX, this.world.centerY - ((this.world.height / 2) / 2), "Loading", { font: "36px Chunk", fill: "#ffffff", align: "center" });
        this.loadingText.anchor.setTo(0.5, 0.5);

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadBar);
		
		
		
		//Map
		//this.load.image('tileset', 'assets/tiles_spritesheet.png');
		//this.load.tilemap('map_json', 'assets/map_json.json', null, Phaser.Tilemap.TILED_JSON);
		
		//Sprite sheets
		//this.load.spritesheet('player', 'assets/player.png', 24, 24, 3);
		
		//Images
		this.load.image('icon_volume', 'assets/icon_volume.png');
		this.load.image('icon_volume_hover', 'assets/icon_volume_hover.png');
		this.load.image('ship', 'assets/ship.png');
		this.load.image('pad', 'assets/pad.png');
		this.load.image('block', 'assets/block.png');
		this.load.image('ground', 'assets/ground.png');
		this.load.image('life', 'assets/life.png');
		this.game.load.spritesheet('explosion', 'assets/explosion.png', 128, 128);
		
		//Audio
        this.load.audio('music', 'assets/sounds/Chiptune_Motorcade.mp3');
        this.load.audio('pause_music', 'assets/sounds/pause_music.mp3');
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