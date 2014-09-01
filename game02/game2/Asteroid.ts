module Game2 {

    export class Asteroid {

        private game: Phaser.Game;
        public sprite: Phaser.Sprite;

        public speed: number;
        public damage: number;
        public type: number

        public created: boolean;

        constructor(game: Phaser.Game) {
            this.game = game;
            this.created = false;
        }

        createAsteroid(x: number, y: number, sprite: string, speed: number, damage: number, type: number) {
            this.sprite = new Phaser.Sprite(this.game, x, y, sprite, 0);
            this.sprite.anchor.setTo(0.5, 0.5);

            this.speed = speed;
            this.damage = damage;
            this.type = type;

            this.game.add.existing(this.sprite);
        }

        createRandomPosition() {
            var x: number = 0;
            var y: number = 0;
            var tweenX: number = 0;
            var tweenY: number = 0;

            var rnd: number = this.game.rnd.integerInRange(0, 4);
            if (rnd == 0) {
                x = this.game.rnd.integerInRange(0, this.game.width);
                y = (this.sprite.height / 2 + 2);
                tweenX = this.game.rnd.integerInRange(0, this.game.width);
                tweenY = this.game.height + this.sprite.height;
            } else if (rnd == 1) {
                x = this.game.rnd.integerInRange(0, this.game.width);
                y = (this.sprite.height / 2 - 2);
                tweenX = this.game.rnd.integerInRange(0, this.game.width);
                tweenY = -this.sprite.height;
            } else if (rnd == 2) {
                x = -(this.sprite.width / 2 + 2);
                y = this.game.rnd.integerInRange(0, this.game.height);
                tweenX = this.game.width + this.sprite.width;
                tweenY = this.game.rnd.integerInRange(0, this.game.height);
            }
            else if (rnd == 3) {
                x = this.game.width + (this.sprite.width / 2 - 2);
                y = this.game.rnd.integerInRange(0, this.game.height);
                tweenX = -this.sprite.width;
                tweenY = this.game.rnd.integerInRange(0, this.game.height);
            }

            if (x > 0 && x <= this.game.width / 2) {
                x *= -1;
            } else if (x > this.game.width / 2 && x <= this.game.width) {
                x *= 2;
            }

            if (y > 0 && y <= this.game.height / 2) {
                y *= -1;
            } else if (y > this.game.height / 2 && y <= this.game.height) {
                y *= 2;
            }

            this.sprite.reset(x, y);
            this.sprite.angle = 90 + Math.atan2(y - tweenX, x - tweenY) * 180 / Math.PI;

            var tween = this.game.add.tween(this.sprite).to(
                { x: tweenX, y: tweenY },
                this.game.rnd.integerInRange((2000 - (1000 * Level.DIFFICULTY)) * this.type, (4000 - (2000 * Level.DIFFICULTY)) * this.type),
                Phaser.Easing.Linear.None, true,
                this.game.rnd.integerInRange(250 - (200 * Level.DIFFICULTY), 750 - (600 * Level.DIFFICULTY))
            );

            this.created = true;

            tween.onComplete.add(this.destroyAsteroidOutOfBounds, this);
        }

        destroyAsteroid() {
            this.sprite.kill();
            this.created = false;
            Level.SCORE += 1;
            Level.DIFFICULTY += 0.01;
        }

        destroyAsteroidOutOfBounds() {
            this.sprite.kill();
            this.created = false;
            if (Level.doUpdate) {
                Level.SCORE += 1;
                Level.DIFFICULTY += 0.01;
            }
        }
    }
}