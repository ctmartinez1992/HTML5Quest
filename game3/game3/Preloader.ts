module Game3 {

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
            this.load.image('life', 'assets/life.png');

            this.load.spritesheet('bullets', 'assets/bullets.png', 7, 23);
            this.load.spritesheet('enemies', 'assets/enemies.png', 28, 30);
            this.load.spritesheet('enemyBullets', 'assets/enemyBullets.png', 15, 15);
            this.load.spritesheet('boom', 'assets/explosion.png', 64, 64, 37);

            this.load.audio('explosion_enemy', 'assets/sound/explosion_enemy.wav', true);
            this.load.audio('explosion_player', 'assets/sound/explosion_player.wav', true);
            this.load.audio('hit_player', 'assets/sound/hit_player.wav', true);
            this.load.audio('laser_enemy', 'assets/sound/laser_enemy.wav', true);
            this.load.audio('laser_player', 'assets/sound/laser_player.wav', true);
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