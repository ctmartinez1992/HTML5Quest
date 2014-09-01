module Game1 {

    export class Ball extends Phaser.Sprite {

        vel: number;
        firstVel: number;
        dir: number;

        constructor(game: Phaser.Game, x: number, y: number, vel: number, dir: number) {
            super(game, x, y, 'ball', 0);

            this.anchor.setTo(0.5, 0.5);

            this.vel = vel;
            this.firstVel = vel;
            this.dir = dir;

            game.add.existing(this);
        }

        updateBall() {
            this.body.x = this.body.x + this.vel * Math.cos(this.dir);
            this.body.y = this.body.y + this.vel * Math.sin(this.dir);
        }

        resetBall(dir: number) {
            this.body.x = this.game.world.centerX - this.height / 2;
            this.body.y = this.game.world.centerY - this.width / 2;
            this.vel = this.firstVel;
            this.dir = dir;
        }
    }
}