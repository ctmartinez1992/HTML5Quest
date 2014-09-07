Game11 = {};

Game11.Boot = function (game) {
	orientated = false;
};

Game11.Boot.prototype = {
    preload: function () {
        this.load.image('preloadBar', 'assets/loader.png');
    },

    create: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.stage.smoothed = false;
        if (this.game.device.desktop) {
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.minWidth = 480;
			this.scale.minHeight = 260;
			this.scale.maxWidth = 1200;
			this.scale.maxHeight = 800;
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
			this.scale.setScreenSize(true);
        } else {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 480;
            this.scale.minHeight = 320;
            this.scale.maxWidth = 1200;
            this.scale.maxHeight = 800;
            this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
			this.scale.forceOrientation(true, false);
			this.scale.hasResized.add(this.gameResized, this);
			this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
			this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
			this.scale.setScreenSize(true);
        }

        this.state.start('Preloader');
    },
	
	gameResized: function (width, height) {
		// This could be handy if you need to do any extra processing if the game resizes.
		// A resize could happen if for example swapping orientation on a device.
	},
	
	enterIncorrectOrientation: function () {
		BasicGame.orientated = false;
		document.getElementById('orientation').style.display = 'block';
	},
	
	leaveIncorrectOrientation: function () {
		BasicGame.orientated = true;
		document.getElementById('orientation').style.display = 'none';
	}
};
