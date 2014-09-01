module Game1 {

    export class Player extends Phaser.Sprite {

        top: Phaser.Sprite;
        bot: Phaser.Sprite;

        speed: number;
        firstSpeed: number;

        constructor(game: Phaser.Game, top: Phaser.Sprite, bot: Phaser.Sprite, x: number, y: number, speed: number) {
            super(game, x, y, 'pad', 0);

            this.top = top;
            this.bot = bot;
            this.speed = speed;
            this.firstSpeed = speed;

            this.anchor.setTo(0.5, 0.5);

            game.add.existing(this);
        }

        updatePlayer() {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                if (!this.game.physics.collide(this, this.top, null, null, this)) {
                    this.body.y += -this.speed;
                }
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                if (!this.game.physics.collide(this, this.bot, null, null, this)) {
                    this.body.y += this.speed;
                }
            }

            this.body.x = 50;
        }

        resetPlayer() {
            this.body.x = 50;
            this.body.y = this.game.world.centerY - this.height / 2;
            this.speed = this.firstSpeed;
        }
    }
}