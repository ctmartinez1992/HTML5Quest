window.onload = function () {
    var game = new Game2.Game();
};
var Game2;
(function (Game2) {
    var AsteroidManager = (function () {
        function AsteroidManager(game) {
            this.asteroids = [];
            this.game = game;

            this.currentPos = 0;
        }
        AsteroidManager.prototype.addRandomAsteroid = function () {
            if (this.game.rnd.integerInRange(0, 3) == 1) {
                this.addMediumAsteroid(0, 0);
            } else {
                this.addSmallAsteroid(0, 0);
            }
        };

        AsteroidManager.prototype.addSmallAsteroid = function (x, y) {
            this.asteroids.push(new Game2.Asteroid(this.game));

            var randomSmall = this.game.rnd.integerInRange(0, 4);
            var smallAsteroid = "asteroid_small_1";
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
        };

        AsteroidManager.prototype.addMediumAsteroid = function (x, y) {
            this.asteroids.push(new Game2.Asteroid(this.game));

            var randomSmall = this.game.rnd.integerInRange(0, 2);
            var mediumAsteroid = "asteroid_medium_1";
            if (randomSmall == 1) {
                mediumAsteroid = "asteroid_medium_2";
            }

            this.asteroids[this.currentPos].createAsteroid(x, y, mediumAsteroid, 100, 20, 2);
            this.asteroids[this.currentPos].createRandomPosition();
            this.currentPos += 1;
        };

        AsteroidManager.prototype.updateAsteroidCollision = function (player, level) {
            var gameOver = false;
            for (var i = 0; i < this.asteroids.length; i++) {
                if (this.asteroids[i].created) {
                    gameOver = this.game.physics.collide(player, this.asteroids[i].sprite);
                    if (gameOver) {
                        this.game.time.events.remove(level.asteroidSpawn);
                        this.game.state.start('GameOver');
                    }
                }
            }
        };
        return AsteroidManager;
    })();
    Game2.AsteroidManager = AsteroidManager;
})(Game2 || (Game2 = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game2;
(function (Game2) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'assets/loader.png');
        };

        Boot.prototype.create = function () {
            //Set the background color
            this.stage.backgroundColor = '#000000';

            //Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;

            //Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
                //If you have any desktop specific settings, they can go in here
                this.stage.scale.pageAlignHorizontally = true;
            } else {
                //Same goes for mobile settings.
            }

            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    Game2.Boot = Boot;
})(Game2 || (Game2 = {}));
var Game2;
(function (Game2) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 500, 700, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Game2.Boot, false);
            this.state.add('Preloader', Game2.Preloader, false);
            this.state.add('Level', Game2.Level, false);
            this.state.add('GameOver', Game2.GameOver, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Game2.Game = Game;
})(Game2 || (Game2 = {}));
var Game2;
(function (Game2) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver() {
            _super.apply(this, arguments);
        }
        GameOver.prototype.create = function () {
            this.sound.stopAll();

            this.explosion = this.add.audio('explosion', 0.75, false);
            this.explosion.play();

            this.gameOverText = this.add.text(this.world.centerX, this.world.centerY - 150, "GAME OVER", { font: "26px Chunk", fill: "#ffffff", align: "center" });
            this.gameOverText.anchor.setTo(0.5, 0.5);

            this.playerScore = this.add.text(this.world.centerX, this.world.centerY, "Score " + Game2.Level.SCORE, { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.playerScore.anchor.setTo(0.5, 0.5);

            this.introText = this.add.text(this.world.centerX, this.world.centerY + 100, "Press R to try again", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
        };

        GameOver.prototype.update = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                this.game.state.start('Level');
            }
        };
        return GameOver;
    })(Phaser.State);
    Game2.GameOver = GameOver;
})(Game2 || (Game2 = {}));
var Game2;
(function (Game2) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            _super.apply(this, arguments);
        }
        Level.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game2.Volume(this.game, 5, this.world.height - 30);

            //Scores
            this.playerScore = this.add.text(10, 10, "Score " + Level.SCORE, { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Sound
            this.music = this.add.audio('asteroid_march', 1.0, true);
            this.music.play('', 0, 0.5, true);

            //Player, enemy and the ball
            this.player = new Game2.Player(this.game, this.world.centerX, this.world.height - 50);

            //Asteroids group
            this.asteroidManager = new Game2.AsteroidManager(this.game);

            //Booleans
            Level.doIntro = true;
            Level.doUpdate = false;

            //Counters
            Level.PLAYER_SPEED = 5;
            Level.DIFFICULTY = 0;
            Level.SCORE = 0;

            //Intro
            this.titleText = this.add.text(this.world.centerX, this.world.centerY - 225, "Asteroid Field", { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.titleText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.titleText.position).to({ y: this.world.centerY - 250 }, 250, Phaser.Easing.Elastic.In, true).to({ y: this.world.centerY - 200 }, 250, Phaser.Easing.Exponential.Out, true).loop();
            this.introText = this.add.text(this.world.centerX, this.world.centerY - 50, "Press space to start", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
            this.instructionsText = this.add.text(this.world.centerX, this.world.centerY + 200, "Arrows to move; Avoid asteroids", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.instructionsText.anchor.setTo(0.5, 0.5);
        };

        Level.prototype.update = function () {
            //Do the intro
            if (Level.doIntro) {
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = 0;
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                    //Get ready to start game
                    Level.doIntro = false;
                    Level.doUpdate = true;
                    this.titleText.visible = false;
                    this.introText.visible = false;
                    this.instructionsText.visible = false;

                    //Generate new asteroids
                    this.asteroidSpawn = this.time.events.loop(300 - (250 * (Level.DIFFICULTY - Level.DIFFICULTY)), this.generateNewAsteroid, this);
                }
            }

            //Update the game
            if (Level.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                //Update score
                this.playerScore.content = "Score " + Level.SCORE;

                //Decrease player speed based on score
                if (Level.SCORE % 10 == 0) {
                    Level.PLAYER_SPEED -= 0.2;
                    if (Level.PLAYER_SPEED <= 2) {
                        Level.PLAYER_SPEED = 2;
                    }
                }

                //Asteroid collision with player
                this.asteroidManager.updateAsteroidCollision(this.player, this);
            }
        };

        Level.prototype.generateNewAsteroid = function () {
            this.asteroidManager.addRandomAsteroid();
        };
        Level.PLAYER_SPEED = 5;
        Level.DIFFICULTY = 0;
        Level.SCORE = 0;
        return Level;
    })(Phaser.State);
    Game2.Level = Level;
})(Game2 || (Game2 = {}));
var Game2;
(function (Game2) {
    var Asteroid = (function () {
        function Asteroid(game) {
            this.game = game;
            this.created = false;
        }
        Asteroid.prototype.createAsteroid = function (x, y, sprite, speed, damage, type) {
            this.sprite = new Phaser.Sprite(this.game, x, y, sprite, 0);
            this.sprite.anchor.setTo(0.5, 0.5);

            this.speed = speed;
            this.damage = damage;
            this.type = type;

            this.game.add.existing(this.sprite);
        };

        Asteroid.prototype.createRandomPosition = function () {
            var x = 0;
            var y = 0;
            var tweenX = 0;
            var tweenY = 0;

            var rnd = this.game.rnd.integerInRange(0, 4);
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
            } else if (rnd == 3) {
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

            var tween = this.game.add.tween(this.sprite).to({ x: tweenX, y: tweenY }, this.game.rnd.integerInRange((2000 - (1000 * Game2.Level.DIFFICULTY)) * this.type, (4000 - (2000 * Game2.Level.DIFFICULTY)) * this.type), Phaser.Easing.Linear.None, true, this.game.rnd.integerInRange(250 - (200 * Game2.Level.DIFFICULTY), 750 - (600 * Game2.Level.DIFFICULTY)));

            this.created = true;

            tween.onComplete.add(this.destroyAsteroidOutOfBounds, this);
        };

        Asteroid.prototype.destroyAsteroid = function () {
            this.sprite.kill();
            this.created = false;
            Game2.Level.SCORE += 1;
            Game2.Level.DIFFICULTY += 0.01;
        };

        Asteroid.prototype.destroyAsteroidOutOfBounds = function () {
            this.sprite.kill();
            this.created = false;
            if (Game2.Level.doUpdate) {
                Game2.Level.SCORE += 1;
                Game2.Level.DIFFICULTY += 0.01;
            }
        };
        return Asteroid;
    })();
    Game2.Asteroid = Asteroid;
})(Game2 || (Game2 = {}));
var Game2;
(function (Game2) {
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
    Game2.Volume = Volume;
})(Game2 || (Game2 = {}));
var Game2;
(function (Game2) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'player', 0);
            this.SPEED = 200;

            this.anchor.setTo(0.5, 0.5);

            this.animations.add('hover');
            this.animations.play('hover', 10, true);

            game.add.existing(this);
        }
        Player.prototype.updatePlayer = function () {
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
        };

        Player.prototype.resetPlayer = function () {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.body.x = this.game.world.centerX;
            this.body.y = this.game.world.height - 50;
            Game2.Level.SCORE = 0;
            Game2.Level.DIFFICULTY = 0;
        };
        return Player;
    })(Phaser.Sprite);
    Game2.Player = Player;
})(Game2 || (Game2 = {}));
var Game2;
(function (Game2) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            //Preload bar and Loading text
            this.loadingText = this.add.text(this.world.centerX, this.world.centerY - ((this.world.height / 2) / 2), "Loading", { font: "36px Chunk", fill: "#ffffff", align: "center" });
            this.loadingText.anchor.setTo(0.5, 0.5);

            this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadBar');
            this.preloadBar.anchor.setTo(0.5, 0.5);
            this.load.setPreloadSprite(this.preloadBar);

            //Load our actual games assets
            this.load.image('logo', 'assets/logo.png');
            this.load.image('icon_volume', 'assets/icon_volume.png');
            this.load.image('icon_volume_hover', 'assets/icon_volume_hover.png');
            this.load.image('asteroid_small_1', 'assets/asteroid_small_1.png');
            this.load.image('asteroid_small_2', 'assets/asteroid_small_2.png');
            this.load.image('asteroid_small_3', 'assets/asteroid_small_3.png');
            this.load.image('asteroid_small_4', 'assets/asteroid_small_4.png');
            this.load.image('asteroid_medium_1', 'assets/asteroid_medium_1.png');
            this.load.image('asteroid_medium_2', 'assets/asteroid_medium_2.png');

            this.load.spritesheet('player', 'assets/player_ss.png', 40, 40, 4);

            this.load.audio('explosion', 'assets/sound/explosion.wav', true);
            this.load.audio('asteroid_march', 'assets/sound/asteroid_march.mp3', true);
        };

        Preloader.prototype.create = function () {
            //Draw loaded text
            this.loadingText.content = "Loaded";
            this.loadingText.anchor.setTo(0.5, 0.5);

            //Animate loaded text
            this.add.tween(this.loadingText).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.In, true);

            //Animate preload bar up...
            this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.In, true);
            var tween = this.add.tween(this.preloadBar).to({ y: (this.game.canvas.height / 2) }, 1000, Phaser.Easing.Exponential.In, true);

            tween.onComplete.add(this.startLevel, this);
        };

        Preloader.prototype.startLevel = function () {
            this.game.state.start('Level', true, false);
        };
        return Preloader;
    })(Phaser.State);
    Game2.Preloader = Preloader;
})(Game2 || (Game2 = {}));
//# sourceMappingURL=game.js.map
