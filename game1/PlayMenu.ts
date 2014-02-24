module Game1 {

    export class PlayMenu extends Phaser.State {

        btnEasy: Phaser.Button;
        btnNormal: Phaser.Button;
        btnHard: Phaser.Button;
        btnImpossible: Phaser.Button;
        btnBack: Phaser.Button;

        create() {
            this.btnEasy = this.add.button(this.world.centerX, 100, 'btn_easy', this.playEasyClick, this, 1, 0, 2);
            this.btnEasy.anchor.setTo(0.5, 0.5);
            this.btnEasy.alpha = 0;

            this.btnNormal = this.add.button(this.world.centerX, 190, 'btn_normal', this.playNormalClick, this, 1, 0, 2);
            this.btnNormal.anchor.setTo(0.5, 0.5);
            this.btnNormal.alpha = 0;

            this.btnHard = this.add.button(this.world.centerX, 280, 'btn_hard', this.playHardClick, this, 1, 0, 2);
            this.btnHard.anchor.setTo(0.5, 0.5);
            this.btnHard.alpha = 0;

            this.btnImpossible = this.add.button(this.world.centerX, 370, 'btn_impossible', this.playImpossibleClick, this, 1, 0, 2);
            this.btnImpossible.anchor.setTo(0.5, 0.5);
            this.btnImpossible.alpha = 0;

            this.btnBack = this.add.button(74, 558, 'btn_back', this.GoBackClick, this, 1, 0, 2);
            this.btnBack.anchor.setTo(0.5, 0.5);
            this.btnBack.alpha = 0;

            this.add.tween(this.btnEasy).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.btnNormal).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.btnHard).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 750);
            this.add.tween(this.btnImpossible).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1000);
            this.add.tween(this.btnBack).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1250);
        }

        playEasyClick() {
            this.add.tween(this.btnEasy).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.btnNormal).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.btnHard).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 750);
            this.add.tween(this.btnImpossible).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1000);
            var tween = this.add.tween(this.btnBack).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1250);

            tween.onComplete.add(this.startEasyGame, this);
        }

        playNormalClick() {
            this.add.tween(this.btnEasy).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.btnNormal).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.btnHard).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 750);
            this.add.tween(this.btnImpossible).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1000);
            var tween = this.add.tween(this.btnBack).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1250);

            tween.onComplete.add(this.startNormalGame, this);
        }

        playHardClick() {
            this.add.tween(this.btnEasy).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.btnNormal).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.btnHard).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 750);
            this.add.tween(this.btnImpossible).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1000);
            var tween = this.add.tween(this.btnBack).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1250);

            tween.onComplete.add(this.startHardGame, this);
        }

        playImpossibleClick() {
            this.add.tween(this.btnEasy).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.btnNormal).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.btnHard).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 750);
            this.add.tween(this.btnImpossible).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1000);
            var tween = this.add.tween(this.btnBack).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1250);

            tween.onComplete.add(this.startImpossibleGame, this);
        }

        GoBackClick() {
            this.add.tween(this.btnEasy).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.btnNormal).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.btnHard).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 750);
            this.add.tween(this.btnImpossible).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1000);
            var tween = this.add.tween(this.btnBack).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1250);

            tween.onComplete.add(this.goBack, this);
        }

        startEasyGame() {
            this.game.state.start('LevelEasy', true, false);
        }

        startNormalGame() {
            this.game.state.start('LevelNormal', true, false);
        }

        startHardGame() {
            this.game.state.start('LevelHard', true, false);
        }

        startImpossibleGame() {
            this.game.state.start('LevelImpossible', true, false);
        }

        goBack() {
            this.game.state.start('MainMenu', true, false);
        }
    }
}