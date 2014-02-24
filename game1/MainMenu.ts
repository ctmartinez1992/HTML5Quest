module Game1 {

    export class MainMenu extends Phaser.State {

        logo: Phaser.Sprite;

        btnPlay: Phaser.Button;

        create() {
            //Logo
            this.logo = this.add.sprite(this.world.centerX, -150, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);

            this.add.tween(this.logo).to({ y: 150 }, 1000, Phaser.Easing.Elastic.Out, true, 500);

            //Dem buttons
            this.btnPlay = this.add.button(this.world.centerX, this.world.centerY, 'btn_play', this.playClick, this, 1, 0, 2);
            this.btnPlay.anchor.setTo(0.5, 0.5);
            this.btnPlay.alpha = 0;

            this.add.tween(this.btnPlay).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1000);

            this.sound.stopAll();
        }

        playClick() {
            var tween = this.add.tween(this.logo).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.btnPlay).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 250);

            tween.onComplete.add(this.startPlayMenu, this);
        }

        startPlayMenu() {
            this.game.state.start('PlayMenu', true, false);
        }
    }
}