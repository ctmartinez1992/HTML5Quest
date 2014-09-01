var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game4;
(function (Game4) {
    var Start = (function (_super) {
        __extends(Start, _super);
        function Start() {
            _super.apply(this, arguments);
        }
        Start.prototype.create = function () {
            this.sound.stopAll();

            //Intro
            this.title = this.add.sprite(0, this.world.height - 300, "logo");
            this.title.anchor.setTo(0.5, 0.5);
            this.introText = this.add.text(this.world.centerX, this.world.centerY - 50, "Press space to start; r for random level", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
            this.instructionsText = this.add.text(this.world.centerX, this.world.centerY + 200, "Arrows to move; Space to shoot", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.instructionsText.anchor.setTo(0.5, 0.5);
        };

        Start.prototype.update = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.game.state.start('Level1');
            }
        };
        return Start;
    })(Phaser.State);
    Game4.Start = Start;
})(Game4 || (Game4 = {}));
//# sourceMappingURL=Start.js.map
