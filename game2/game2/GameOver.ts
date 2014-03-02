module Game2 {

    export class GameOver extends Phaser.State {

        playerScore: Phaser.Text;
        gameOverText: Phaser.Text;
        introText: Phaser.Text;

        explosion: Phaser.Sound

        create() {
            this.sound.stopAll();

            this.explosion = this.add.audio('explosion', 0.75, false);
            this.explosion.play();

            this.gameOverText = this.add.text(this.world.centerX, this.world.centerY - 150, "GAME OVER", { font: "26px Chunk", fill: "#ffffff", align: "center" });
            this.gameOverText.anchor.setTo(0.5, 0.5);

            this.playerScore = this.add.text(this.world.centerX, this.world.centerY, "Score " + Level.SCORE, { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.playerScore.anchor.setTo(0.5, 0.5);

            this.introText = this.add.text(this.world.centerX, this.world.centerY + 100, "Press R to try again", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
        }

        update() {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                this.game.state.start('Level');
            }
        }
    }
}