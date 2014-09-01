var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game3;
(function (Game3) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'player', 0);
            this.SPEED = 200;

            this.anchor.setTo(0.5, 0.5);

            this.animations.add('hover');
            this.animations.play('hover', 10, true);

            game.add.existing(this);
        }
        Player.prototype.updatePlayer = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x = -this.SPEED;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x = this.SPEED;
            } else {
                this.body.velocity.x = 0;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                this.body.velocity.y = -this.SPEED;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                this.body.velocity.y = this.SPEED;
            } else {
                this.body.velocity.y = 0;
            }
        };

        Player.prototype.resetPlayer = function () {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.body.x = this.game.world.centerX;
            this.body.y = this.game.world.height - 50;
            Game3.Level.SCORE = 0;
            Game3.Level.DIFFICULTY = 0;
        };
        return Player;
    })(Phaser.Sprite);
    Game3.Player = Player;
})(Game3 || (Game3 = {}));
//# sourceMappingURL=Player.js.map
