module Game1 {

    export class Enemy extends Phaser.Sprite {

        top: Phaser.Sprite;
        bot: Phaser.Sprite;

        speed: number;
        firstSpeed: number;

        constructor(game: Phaser.Game, top: Phaser.Sprite, bot: Phaser.Sprite, x: number, y: number, speed: number) {
            super(game, x, y, 'pad_enemy', 0);

            this.top = top;
            this.bot = bot;
            this.speed = speed;
            this.firstSpeed = speed;

            this.anchor.setTo(0.5, 0.5);

            game.add.existing(this);
        }

        updateEnemy() {
            this.body.x = 750;
        }

        moveUp(y: number) {
            if (!this.game.physics.collide(this, this.top, null, null, this)) {
                this.body.y += -this.speed;
            }
        }

        moveDown(y: number) {
            if (!this.game.physics.collide(this, this.bot, null, null, this)) {
                this.body.y += this.speed;
            }
        }

        resetEnemy() {
            this.body.x = 750;
            this.body.y = this.game.world.centerY - this.height / 2;
            this.speed = this.firstSpeed;
        }
    }
}