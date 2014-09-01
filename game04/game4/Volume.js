var Game4;
(function (Game4) {
    var Volume = (function () {
        function Volume(game, x, y) {
            this.game = game;

            this.iconVolume = this.game.add.sprite(x, y, 'icon_volume');
            this.iconVolume.scale.divide(2, 2);
            this.iconVolume.inputEnabled = true;
            this.iconVolume.events.onInputDown.add(this.clickVolume, this);

            this.iconVolumeHover = this.game.add.sprite(x, y, 'icon_volume_hover');
            this.iconVolumeHover.inputEnabled = true;
            this.iconVolumeHover.scale.divide(2, 2);
            this.iconVolumeHover.events.onInputDown.add(this.clickVolume, this);
            this.iconVolumeHover.visible = false;

            this.mute = false;
        }
        Volume.prototype.clickVolume = function () {
            this.mute = !this.mute;
            this.game.sound.mute = this.mute;
            this.iconVolumeHover.visible = this.mute;
            this.iconVolume.visible = !this.iconVolumeHover.visible;
        };

        Volume.prototype.isMute = function () {
            return this.mute;
        };
        return Volume;
    })();
    Game4.Volume = Volume;
})(Game4 || (Game4 = {}));
//# sourceMappingURL=Volume.js.map
