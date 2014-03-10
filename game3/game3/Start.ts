module Game3 {

    export class Start extends Phaser.State {

        titleText: Phaser.Text;
        introText: Phaser.Text;
        instructionsText: Phaser.Text;

        create() {
            this.sound.stopAll();

            //Intro
            this.titleText = this.add.text(this.world.centerX, this.world.centerY - 225, "Space Invaders", { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.titleText.anchor.setTo(0.5, 0.5);
            this.introText = this.add.text(this.world.centerX, this.world.centerY - 50, "Press space to start; r for random level", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
            this.instructionsText = this.add.text(this.world.centerX, this.world.centerY + 200, "Arrows to move; Space to shoot", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.instructionsText.anchor.setTo(0.5, 0.5);
        }

        update() {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.game.state.start('Level1');
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                this.game.state.start('LevelRandom');
            }
        }
    }
}