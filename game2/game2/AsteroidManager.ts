module Game2 {

    export class AsteroidManager {

        game: Phaser.Game;

        asteroids: Asteroid[] = [];

        currentPos: number;

        constructor(game: Phaser.Game) {
            this.game = game;

            this.currentPos = 0;
        }

        addRandomAsteroid() {
            if (this.game.rnd.integerInRange(0, 3) == 1) {
                this.addMediumAsteroid(0, 0);
            } else {
                this.addSmallAsteroid(0, 0);
            }
        }

        addSmallAsteroid(x: number, y: number) {
            this.asteroids.push(new Asteroid(this.game));

            var randomSmall: number = this.game.rnd.integerInRange(0, 4);
            var smallAsteroid: string = "asteroid_small_1";
            if (randomSmall == 1) {
                smallAsteroid = "asteroid_small_2";
            } else if (randomSmall == 2) {
                smallAsteroid = "asteroid_small_3";
            } else if (randomSmall == 3) {
                smallAsteroid = "asteroid_small_4";
            }

            this.asteroids[this.currentPos].createAsteroid(x, y, smallAsteroid, 150, 10, 1);
            this.asteroids[this.currentPos].createRandomPosition();
            this.currentPos += 1;
        }

        addMediumAsteroid(x: number, y: number) {
            this.asteroids.push(new Asteroid(this.game));

            var randomSmall: number = this.game.rnd.integerInRange(0, 2);
            var mediumAsteroid: string = "asteroid_medium_1";
            if (randomSmall == 1) {
                mediumAsteroid = "asteroid_medium_2";
            }

            this.asteroids[this.currentPos].createAsteroid(x, y, mediumAsteroid, 100, 20, 2);
            this.asteroids[this.currentPos].createRandomPosition();
            this.currentPos += 1;
        }

        updateAsteroidCollision(player: Player, level: Level) {
            var gameOver: boolean = false;
            for (var i = 0; i < this.asteroids.length; i++) {
                if (this.asteroids[i].created) {
                    gameOver = this.game.physics.collide(player, this.asteroids[i].sprite);
                    if (gameOver) {
                        this.game.time.events.remove(level.asteroidSpawn);
                        this.game.state.start('GameOver');
                    }
                }
            }
        }
    }
}