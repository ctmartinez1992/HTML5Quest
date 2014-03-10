module Game3 {

    export class Player extends Phaser.Sprite {

        SPEED: number = 200;

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'player', 0);

            this.anchor.setTo(0.5, 0.5);

            game.add.existing(this);
        }

        updatePlayer() {
            this.body.velocity.setTo(0, 0);
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x = -this.SPEED;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x = this.SPEED;
            }
        }
    }
}