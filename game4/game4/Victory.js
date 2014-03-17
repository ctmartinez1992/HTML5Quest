var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game4;
(function (Game4) {
    var Victory = (function (_super) {
        __extends(Victory, _super);
        function Victory() {
            _super.apply(this, arguments);
        }
        Victory.prototype.create = function () {
            this.sound.stopAll();

            this.victoryText = this.add.text(this.world.centerX, this.world.centerY - 150, "Victory", { font: "26px Chunk", fill: "#ffffff", align: "center" });
            this.victoryText.anchor.setTo(0.5, 0.5);

            this.introText = this.add.text(this.world.centerX, this.world.centerY + 100, "Press R to play again", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
        };

        Victory.prototype.update = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                this.game.state.start('Start');
            }
        };
        return Victory;
    })(Phaser.State);
    Game4.Victory = Victory;
})(Game4 || (Game4 = {}));
//# sourceMappingURL=Victory.js.map
