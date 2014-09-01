module Game2 {

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
            this.load.image('logo', 'assets/logo.png');
            this.load.image('icon_volume', 'assets/icon_volume.png');
            this.load.image('icon_volume_hover', 'assets/icon_volume_hover.png');
            this.load.image('asteroid_small_1', 'assets/asteroid_small_1.png');
            this.load.image('asteroid_small_2', 'assets/asteroid_small_2.png');
            this.load.image('asteroid_small_3', 'assets/asteroid_small_3.png');
            this.load.image('asteroid_small_4', 'assets/asteroid_small_4.png');
            this.load.image('asteroid_medium_1', 'assets/asteroid_medium_1.png');
            this.load.image('asteroid_medium_2', 'assets/asteroid_medium_2.png');

            this.load.spritesheet('player', 'assets/player_ss.png', 40, 40, 4);

            this.load.audio('explosion', 'assets/sound/explosion.wav', true);
            this.load.audio('asteroid_march', 'assets/sound/asteroid_march.mp3', true);
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
            this.game.state.start('Level', true, false);
        }
    }
}