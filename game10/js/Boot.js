Game10 = {};

Game10.Boot = function (game) {
};

Game10.Boot.prototype = {
    preload: function () {
        this.load.image('preloadBar', 'assets/loader.png');
    },

    create: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.stage.smoothed = false;
        if (this.game.device.desktop) {
            this.scale.pageAlignHorizontally = true;
        } else {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 480;
            this.scale.minHeight = 320;
            this.scale.maxWidth = 1024;
            this.scale.maxHeight = 768;
            this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
        }

        this.state.start('Preloader');
    }
};
