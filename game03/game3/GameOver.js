var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game3;
(function (Game3) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver() {
            _super.apply(this, arguments);
        }
        GameOver.prototype.create = function () {
            this.sound.stopAll();

            this.explosion = this.add.audio('explosion', 0.75, false);
            this.explosion.play();

            this.gameOverText = this.add.text(this.world.centerX, this.world.centerY - 150, "GAME OVER", { font: "26px Chunk", fill: "#ffffff", align: "center" });
            this.gameOverText.anchor.setTo(0.5, 0.5);

            this.playerScore = this.add.text(this.world.centerX, this.world.centerY, "Score " + Game3.Level.SCORE, { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.playerScore.anchor.setTo(0.5, 0.5);

            this.introText = this.add.text(this.world.centerX, this.world.centerY + 100, "Press R to try again", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
        };

        GameOver.prototype.update = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                this.game.state.start('Level');
            }
        };
        return GameOver;
    })(Phaser.State);
    Game3.GameOver = GameOver;
})(Game3 || (Game3 = {}));
//# sourceMappingURL=GameOver.js.map
