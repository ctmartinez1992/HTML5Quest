module Game4 {

    export class Player extends Phaser.Sprite {

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'player', 0);

            game.add.existing(this);
        }

        updatePlayer() {
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.x >= 456) {
                this.x = 456;
            }
        }
    }
}