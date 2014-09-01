module Game2 {

    export class Player extends Phaser.Sprite {

        SPEED: number = 200;

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'player', 0);

            this.anchor.setTo(0.5, 0.5);
            
            this.animations.add('hover');
            this.animations.play('hover', 10, true);

            game.add.existing(this);
        }

        updatePlayer() {
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
        }

        resetPlayer() {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.body.x = this.game.world.centerX;
            this.body.y = this.game.world.height - 50;
            Level.SCORE = 0;
            Level.DIFFICULTY = 0;
        }
    }
}