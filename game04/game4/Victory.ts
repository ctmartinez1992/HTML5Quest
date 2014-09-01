module Game4 {

    export class Victory extends Phaser.State {

        victoryText: Phaser.Text;
        introText: Phaser.Text;

        create() {
            this.sound.stopAll();

            this.victoryText = this.add.text(this.world.centerX, this.world.centerY - 150, "Victory", { font: "26px Chunk", fill: "#ffffff", align: "center" });
            this.victoryText.anchor.setTo(0.5, 0.5);

            this.introText = this.add.text(this.world.centerX, this.world.centerY + 100, "Press R to play again", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
        }

        update() {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                this.game.state.start('Start');
            }
        }
    }
}