var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game4;
(function (Game4) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            //Preload bar and Loading text
            this.loadingText = this.add.text(this.world.centerX, this.world.centerY - ((this.world.height / 2) / 2), "Loading", { font: "36px Chunk", fill: "#ffffff", align: "center" });
            this.loadingText.anchor.setTo(0.5, 0.5);

            this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadBar');
            this.preloadBar.anchor.setTo(0.5, 0.5);
            this.load.setPreloadSprite(this.preloadBar);

            //Load our actual games assets
            this.load.image('logo', 'assets/logo.png');
            this.load.image('icon_volume', 'assets/icon_volume.png');
            this.load.image('icon_volume_hover', 'assets/icon_volume_hover.png');
            this.load.image('player', 'assets/player.png');
            this.load.image('box', 'assets/box.png');
            this.load.image('bullet', 'assets/bullet.png');
            this.load.image('bullet_blast', 'assets/bullet_blast.png');
            this.load.image('bullet_row', 'assets/bullet_row.png');
            this.load.image('bullet_column', 'assets/bullet_column.png');
            this.load.image('lose_box', 'assets/lose_box.png');
            //this.load.spritesheet('bullets', 'assets/bullets.png', 7, 23);
            //this.load.audio('explosion_enemy', 'assets/sound/explosion_enemy.wav', true);
        };

        Preloader.prototype.create = function () {
            //Draw loaded text
            this.loadingText.content = "Loaded";
            this.loadingText.anchor.setTo(0.5, 0.5);

            //Animate loaded text
            this.add.tween(this.loadingText).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.In, true);

            //Animate preload bar up...
            this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.In, true);
            var tween = this.add.tween(this.preloadBar).to({ y: (this.game.canvas.height / 2) }, 1000, Phaser.Easing.Exponential.In, true);

            tween.onComplete.add(this.startLevel, this);
        };

        Preloader.prototype.startLevel = function () {
            this.game.state.start('Start', true, false);
        };
        return Preloader;
    })(Phaser.State);
    Game4.Preloader = Preloader;
})(Game4 || (Game4 = {}));
//# sourceMappingURL=Preloader.js.map
