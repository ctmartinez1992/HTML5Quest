module Game1 {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;
        loadingText: Phaser.Text;

        preload() {
            //Preload bar and Loading text
            this.loadingText = this.add.text(this.world.centerX, this.world.centerY - ((this.world.height / 2) / 2), "Loading", { font: "48px Chunk", fill: "#ffffff", align: "center" });
            this.loadingText.anchor.setTo(0.5, 0.5);

            this.preloadBar = this.add.sprite((this.game.canvas.width / 2) - (600 / 2), (this.game.canvas.height / 2) - (50 / 2), 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            //Load our actual games assets
            this.load.image('logo', 'assets/pong.png');
            this.load.image('field_laterals', 'assets/field_laterals.png');
            this.load.image('field_verticals', 'assets/field_verticals.png');
            this.load.image('pad', 'assets/pad.png');
            this.load.image('pad_enemy', 'assets/pad_enemy.png');
            this.load.image('pad_enemy_impossible', 'assets/pad_enemy_impossible.png');
            this.load.image('ball', 'assets/ball.png');
            this.load.image('win_w', 'assets/win_lose/W.png');
            this.load.image('win_i', 'assets/win_lose/I.png');
            this.load.image('win_n', 'assets/win_lose/N.png');
            this.load.image('win_e', 'assets/win_lose/E.png');
            this.load.image('win_r', 'assets/win_lose/R.png');
            this.load.image('game_over', 'assets/win_lose/game_over.png');
            this.load.image('icon_volume', 'assets/icon_volume.png');
            this.load.image('icon_volume_hover', 'assets/icon_volume_hover.png');

            this.load.spritesheet('btn_play', 'assets/buttons/btn_play.png', 128, 64);
            this.load.spritesheet('btn_easy', 'assets/buttons/btn_easy.png', 128, 64);
            this.load.spritesheet('btn_normal', 'assets/buttons/btn_normal.png', 128, 64);
            this.load.spritesheet('btn_hard', 'assets/buttons/btn_hard.png', 128, 64);
            this.load.spritesheet('btn_impossible', 'assets/buttons/btn_impossible.png', 128, 64);
            this.load.spritesheet('btn_credits', 'assets/buttons/btn_credits.png', 128, 64);
            this.load.spritesheet('btn_back', 'assets/buttons/btn_back.png', 128, 64);
            this.load.spritesheet('btn_mainmenu', 'assets/buttons/btn_mainmenu.png', 128, 64);
            this.load.spritesheet('btn_restart', 'assets/buttons/btn_restart.png', 128, 64);

            this.load.audio('beep1', 'assets/sound/beep1.wav', false);
            this.load.audio('beep32', 'assets/sound/beep32.wav', false);
            this.load.audio('hit_wall', 'assets/sound/hit_wall.wav', true);
            this.load.audio('hit_pad', 'assets/sound/hit_pad.wav', true);
            this.load.audio('player_point', 'assets/sound/player_point.wav', true);
            this.load.audio('enemy_point', 'assets/sound/enemy_point.wav', true);
            this.load.audio('win', 'assets/sound/win.wav', true);
            this.load.audio('lose', 'assets/sound/lose.wav', true);
            this.load.audio('laugh', 'assets/sound/laugh.mp3', true);
            this.load.audio('elevator', 'assets/sound/elevator.mp3', true);
            this.load.audio('the_big_game', 'assets/sound/the_big_game.mp3', true);
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

            tween.onComplete.add(this.startMainMenu, this);
        }

        startMainMenu() {
            this.game.state.start('MainMenu', true, false);
        }
    }
}