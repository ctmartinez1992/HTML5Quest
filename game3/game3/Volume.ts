module Game3 {

    export class Volume {

        game: Phaser.Game;

        iconVolume: Phaser.Sprite;
        iconVolumeHover: Phaser.Sprite;

        mute: boolean;

        constructor(game: Phaser.Game, x: number, y: number) {
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

        clickVolume() {
            this.mute = !this.mute;
            this.game.sound.mute = this.mute;
            this.iconVolumeHover.visible = this.mute;
            this.iconVolume.visible = !this.iconVolumeHover.visible
        }

        isMute() {
            return this.mute;
        }
    }
}