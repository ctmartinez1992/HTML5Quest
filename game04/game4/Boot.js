var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game4;
(function (Game4) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'assets/loader.png');
        };

        Boot.prototype.create = function () {
            this.game.stage.disableVisibilityChange = true;
            this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
            if (this.game.device.desktop) {
                this.game.stage.scale.pageAlignHorizontally = true;
                this.game.stage.scale.setScreenSize(true);
            } else {
                this.game.stage.scale.setScreenSize(true);
            }
            this.game.state.start("Preloader");
        };
        return Boot;
    })(Phaser.State);
    Game4.Boot = Boot;
})(Game4 || (Game4 = {}));
//# sourceMappingURL=Boot.js.map
