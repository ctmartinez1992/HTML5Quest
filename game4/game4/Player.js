var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game4;
(function (Game4) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'player', 0);
            this.SPEED = 200;

            this.anchor.setTo(0.5, 0.5);

            game.add.existing(this);
        }
        Player.prototype.updatePlayer = function () {
            this.body.velocity.setTo(0, 0);
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x = -this.SPEED;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x = this.SPEED;
            }
        };
        return Player;
    })(Phaser.Sprite);
    Game4.Player = Player;
})(Game4 || (Game4 = {}));
//# sourceMappingURL=Player.js.map
