module Game4 {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;
        loadingText: Phaser.Text;

        preload() {
            //Preload bar and Loading text
            this.loadingText = this.add.text(this.world.centerX, this.world.centerY - ((this.world.height / 2) / 2), "Loading", { font: "36px Chunk", fill: "#ffffff", align: "center" });
            this.loadingText.anchor.setTo(0.5, 0.5);

            this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadBar');
            this.preloadBar.anchor.setTo(0.5, 0.5);
            this.load.setPreloadSprite(this.preloadBar);

            //Load our actual games assets
            this.load.image('icon_volume', 'assets/icon_volume.png');
            this.load.image('icon_volume_hover', 'assets/icon_volume_hover.png');
            this.load.image('player', 'assets/player.png');
            this.load.image('box', 'assets/box.png');
            this.load.image('bullet', 'assets/bullet.png');
            this.load.image('lose_box', 'assets/lose_box.png');
            this.load.image('creativity', 'assets/creativity.png');

            //this.load.spritesheet('bullets', 'assets/bullets.png', 7, 23);

            this.load.audio('box_kill', 'assets/sound/box_kill.wav', true);
            this.load.audio('fire', 'assets/sound/fire.wav', true);
            this.load.audio('music', 'assets/sound/Desperate Attempt to Uplift.mp3', true);
        }

        create() {
            //Draw loaded text
            this.loadingText.content = "Loaded";
            this.loadingText.anchor.setTo(0.5, 0.5);

            //Animate loaded text
            this.add.tween(this.loadingText).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.In, true);

            //Animate preload bar up...
            this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.In, true);
            var tween = this.add.tween(this.preloadBar).to({ y: (this.game.canvas.height / 2) }, 1000, Phaser.Easing.Exponential.In, true);

            tween.onComplete.add(this.startLevel, this);
        }

        startLevel() {
            this.game.state.start('Start', true, false);
        }
    }
}