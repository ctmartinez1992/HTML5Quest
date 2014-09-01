window.onload = function () {
    var game = new Game4.Game();
};
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game4;
(function (Game4) {
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
    Game4.Boot = Boot;
})(Game4 || (Game4 = {}));
var Game4;
(function (Game4) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 480, 480, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Game4.Boot, false);
            this.state.add('Preloader', Game4.Preloader, false);
            this.state.add('Start', Game4.Start, false);
            this.state.add('Level1', Game4.Level1, false);
            this.state.add('Victory', Game4.Victory, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Game4.Game = Game;
})(Game4 || (Game4 = {}));
var Game4;
(function (Game4) {
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
        }
        Level1.prototype.create = function () {
            this.sound.stopAll();
            this.time.events.stop();

            //Volume icon
            this.volume = new Game4.Volume(this.game, 0, this.world.height - 25);

            //Counters
            this.score = 0;
            this.level = 1;
            this.levelCounter = 0;
            this.moveDownTimer = 0;
            this.fireRate = 1;
            this.bulletWait = 0;
            this.firingTimer = 0;
            this.changeRotTimer = 0;
            this.actualTime = 7500 - this.level * 250;
            this.fireTimeControl = 500 - this.fireRate * 25;

            //Text
            this.levelText = this.add.text(this.game.width - 90, 5, 'Level ' + this.level, { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.scoreText = this.add.text(5, 5, 'Score ' + this.score, { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Player
            this.player = new Game4.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies and bullets
            this.enemies = this.add.group();
            this.bullets = this.add.group();
            this.bulletsBlast = this.add.group();
            this.colliders = this.add.group();

            //Lose condition
            this.loseBox = this.add.sprite(0, this.world.height - 24, "lose_box");
            this.loseBox.alpha = 0;

            //Booleans
            this.move = false;
            Level1.doUpdate = true;
            Level1.lost = false;

            //Keys
            this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);
            this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this.lKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            //Sound
            this.boxKillSound = this.game.add.audio("box_kill", 0.1, false);
            this.fireSound = this.game.add.audio("fire", 0.1, false);
            this.music = this.game.add.audio("music", 0.5, true);
            this.music.play();

            //Creation
            this.createEnemies();
            this.createBullets();

            this.time.events.add(1000, this.storyLine, this);
            this.time.events.start();
        };

        Level1.prototype.createEnemies = function () {
            for (var i = 0; i < 20; i++) {
                var sprite = this.add.sprite(i * 24, 24, "box");
                this.enemies.add(sprite);
            }
        };

        Level1.prototype.createBullets = function () {
            this.bullets.createMultiple(30, 'bullet');
            this.bullets.setAll('anchor.x', 0.5);
            this.bullets.setAll('anchor.y', 0.5);
            this.bullets.setAll('outOfBoundsKill', true);
        };

        Level1.prototype.update = function () {
            //Update the game
            if (Level1.doUpdate) {
                if (!Level1.lost) {
                    this.player.updatePlayer();

                    if (this.physics.overlap(this.loseBox, this.enemies)) {
                        Level1.lost = true;
                        this.enemies.callAll('kill');
                        this.bullets.callAll('kill');
                    }

                    if (this.game.time.now > this.moveDownTimer) {
                        this.enemies.addAll("y", 24, false, false);
                        this.createEnemies();
                        this.moveDownTimer = this.game.time.now + this.actualTime;
                    }

                    if (this.rKey.isDown) {
                        if (this.game.time.now > this.changeRotTimer) {
                            this.player.x += 24;
                            this.changeRotTimer = this.game.time.now + 200;
                        }
                    }

                    if (this.lKey.isDown) {
                        if (this.game.time.now > this.changeRotTimer) {
                            this.player.x -= 24;
                            this.changeRotTimer = this.game.time.now + 200;
                        }
                    }

                    if (this.fireKey.isDown) {
                        if (this.game.time.now > this.firingTimer) {
                            this.fire();
                        }
                    }

                    if (this.game.physics.collide(this.bullets, this.enemies, this.bulletCollidesEnemy)) {
                        this.boxKillSound.play();

                        this.score++;
                        this.scoreText.content = "Score " + this.score;

                        this.levelCounter++;
                        if (this.levelCounter >= 10) {
                            this.levelCounter = 0;
                            if (this.level < 10) {
                                this.level++;
                                this.levelText.content = "Level " + this.level;
                                this.fireRate++;
                                this.actualTime = 7500 - this.level * 250;
                                this.fireTimeControl = 500 - this.fireRate * 25;
                            }
                        }
                    }
                }

                if (Level1.lost) {
                    this.loseText1.visible = true;
                    this.loseText3.visible = true;

                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                        this.game.state.start('Start', true, true);
                    }
                }
            }
        };

        Level1.prototype.bulletCollidesEnemy = function (bu, bo) {
            bu.kill();
            bo.kill();
        };

        Level1.prototype.fire = function () {
            this.fireSound.play();
            var bullet = this.bullets.create(this.player.x, this.player.y, 'bullet');
            if (bullet) {
                bullet.reset(this.player.x + 12, this.player.y - 6);
                bullet.anchor.setTo(0.5, 0.5);
                bullet.outOfBoundsKill = true;
                bullet.body.velocity.y = -300;
                this.firingTimer = this.game.time.now + this.fireTimeControl;
            }
        };

        Level1.prototype.resetBullet = function (b) {
            b.kill();
        };

        Level1.prototype.storyLine = function () {
            this.style = { font: "12px Chunk", fill: "#ffffff", align: "center" };

            this.text1 = this.add.text(10, this.game.height - 100, 'This is it...', this.style);
            this.text2 = this.add.text(120, this.game.height - 100, 'the', this.style);
            this.text3 = this.add.text(160, this.game.height - 100, 'extent', this.style);
            this.text4 = this.add.text(235, this.game.height - 100, 'of', this.style);
            this.text5 = this.add.text(262, this.game.height - 100, 'my', this.style);

            this.image1 = this.add.sprite(310, this.game.height - 117, 'creativity');

            this.text1.alpha = 0;
            this.text2.alpha = 0;
            this.text3.alpha = 0;
            this.text4.alpha = 0;
            this.text5.alpha = 0;

            this.image1.alpha = 0;

            this.add.tween(this.text1).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.text2).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1000);
            this.add.tween(this.text3).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1250);
            this.add.tween(this.text4).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1500);
            this.add.tween(this.text5).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1750);
            this.add.tween(this.image1).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 3000).onComplete.addOnce(this.storyLine2, this);
        };

        Level1.prototype.storyLine2 = function () {
            this.text25 = this.add.text(350, this.game.height - 20, '...this week', this.style);

            this.add.tween(this.text1).to({ alpha: 0 }, 1500, Phaser.Easing.Bounce.In, true, 3000);
            this.add.tween(this.text2).to({ alpha: 0 }, 1500, Phaser.Easing.Circular.In, true, 3000);
            this.add.tween(this.text3).to({ alpha: 0 }, 1500, Phaser.Easing.Cubic.In, true, 3000);
            this.add.tween(this.text4).to({ alpha: 0 }, 1500, Phaser.Easing.Elastic.In, true, 3000);
            this.add.tween(this.text5).to({ alpha: 0 }, 1500, Phaser.Easing.Exponential.In, true, 3000);
            this.add.tween(this.image1).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true, 3000);
            this.add.tween(this.text1).to({ y: this.game.height - 50 }, 1500, Phaser.Easing.Quadratic.Out, true, 3000);
            this.add.tween(this.text2).to({ y: this.game.height - 50 }, 1500, Phaser.Easing.Quartic.Out, true, 3000);
            this.add.tween(this.text3).to({ y: this.game.height - 50 }, 1500, Phaser.Easing.Quintic.Out, true, 3000);
            this.add.tween(this.text4).to({ y: this.game.height - 50 }, 1500, Phaser.Easing.Sinusoidal.Out, true, 3000);
            this.add.tween(this.text5).to({ y: this.game.height - 50 }, 1500, Phaser.Easing.Back.InOut, true, 3000);
            this.add.tween(this.image1).to({ y: this.game.height - 50 }, 1500, Phaser.Easing.Linear.None, true, 3000).onComplete.addOnce(this.storyLine3, this);
        };

        Level1.prototype.storyLine3 = function () {
            this.text25.visible = false;
            this.text6 = this.add.text(10, this.game.height - 120, 'Endless', this.style);
            this.text7 = this.add.text(140, this.game.height - 120, 'Waves', this.style);
            this.text8 = this.add.text(245, this.game.height - 120, 'of', this.style);

            this.text6.alpha = 0;
            this.text7.alpha = 0;
            this.text8.alpha = 0;
            this.text6.scale.x = 0.01;
            this.text6.scale.y = 0.01;
            this.text7.scale.x = 0.01;
            this.text7.scale.y = 0.01;
            this.text8.scale.x = 0.01;
            this.text8.scale.y = 0.01;

            this.add.tween(this.text6).to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true);
            this.add.tween(this.text7).to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 125);
            this.add.tween(this.text8).to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.text6.scale).to({ x: 1.5, y: 1.5 }, 250, Phaser.Easing.Linear.None, true, 125);
            this.add.tween(this.text7.scale).to({ x: 1.5, y: 1.5 }, 250, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.text8.scale).to({ x: 1.5, y: 1.5 }, 250, Phaser.Easing.Linear.None, true, 375).onComplete.addOnce(this.storyLine4, this);
        };

        Level1.prototype.storyLine4 = function () {
            this.text9 = this.add.text(40, this.game.height + 120, 'oh', this.style);
            this.text10 = this.add.text(70, this.game.height + 120, 'my', this.style);
            this.text11 = this.add.text(105, this.game.height + 120, 'god', this.style);

            this.add.tween(this.text9).to({ y: this.game.height - 20 }, 1000, Phaser.Easing.Elastic.InOut, true, 3500);
            this.add.tween(this.text10).to({ y: this.game.height - 20 }, 1000, Phaser.Easing.Elastic.InOut, true, 3750);
            this.add.tween(this.text11).to({ y: this.game.height - 20 }, 1000, Phaser.Easing.Elastic.InOut, true, 4000);

            this.particles1 = this.game.add.emitter(370, this.game.height - 100, 50);
            this.particles1.makeParticles('box');
            this.particles1.start(false, 1000, 2, 1000, 100);

            this.time.events.add(5000, this.storyLine5, this);
            this.time.events.start();
        };

        Level1.prototype.storyLine5 = function () {
            this.add.tween(this.text9).to({ y: this.game.height + 120 }, 250, Phaser.Easing.Exponential.Out, true);
            this.add.tween(this.text10).to({ y: this.game.height + 120 }, 250, Phaser.Easing.Exponential.Out, true);
            this.add.tween(this.text11).to({ y: this.game.height + 120 }, 250, Phaser.Easing.Exponential.Out, true);
            this.add.tween(this.text6).to({ y: 1000 }, 500, Phaser.Easing.Linear.None, true, 125);
            this.add.tween(this.text7).to({ y: 1000 }, 500, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.text8).to({ y: 1000 }, 500, Phaser.Easing.Linear.None, true, 375).onComplete.addOnce(this.storyLine6, this);
        };

        Level1.prototype.storyLine6 = function () {
            this.text6.visible = false;
            this.text7.visible = false;
            this.text8.visible = false;
            this.particles1.on = false;

            this.text12 = this.add.text(40, this.game.height - 120, 'Some', this.style);
            this.text13 = this.add.text(95, this.game.height - 120, 'times', this.style);
            this.text14 = this.add.text(160, this.game.height + 120, 'you', this.style);
            this.text15 = this.add.text(200, this.game.height + 120, 'just', this.style);
            this.text16 = this.add.text(250, this.game.height + 120, 'hit', this.style);
            this.text17 = this.add.text(285, this.game.height + 120, 'a', this.style);
            this.text18 = this.add.text(300, this.game.height + 120, 'creative', this.style);
            this.text19 = this.add.text(395, this.game.height + 120, 'wall', this.style);

            this.text12.alpha = 0;
            this.text13.alpha = 0;

            this.add.tween(this.text12).to({ alpha: 1 }, 750, Phaser.Easing.Exponential.In, true);
            this.add.tween(this.text13).to({ alpha: 1 }, 750, Phaser.Easing.Exponential.In, true, 500);
            this.add.tween(this.text14).to({ y: this.game.height - 120 }, 500, Phaser.Easing.Exponential.Out, true, 1000);
            this.add.tween(this.text15).to({ y: this.game.height - 120 }, 500, Phaser.Easing.Exponential.Out, true, 1250);
            this.add.tween(this.text16).to({ y: this.game.height - 120 }, 500, Phaser.Easing.Exponential.Out, true, 1500);
            this.add.tween(this.text17).to({ y: this.game.height - 120 }, 500, Phaser.Easing.Exponential.Out, true, 1750);
            this.add.tween(this.text18).to({ y: this.game.height - 120 }, 500, Phaser.Easing.Exponential.Out, true, 2000);
            this.add.tween(this.text19).to({ y: this.game.height - 120 }, 500, Phaser.Easing.Exponential.Out, true, 2250).onComplete.addOnce(this.storyLine7, this);
        };

        Level1.prototype.storyLine7 = function () {
            this.add.tween(this.text19).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.Out, true, 2000);
            this.add.tween(this.text18).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.Out, true, 2250);
            this.add.tween(this.text17).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.Out, true, 2500);
            this.add.tween(this.text16).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.Out, true, 2750);
            this.add.tween(this.text15).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.Out, true, 3000);
            this.add.tween(this.text14).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.Out, true, 3250);
            this.add.tween(this.text13).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.In, true, 3500);
            this.add.tween(this.text12).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.In, true, 3500).onComplete.addOnce(this.storyLine8, this);
        };

        Level1.prototype.storyLine8 = function () {
            this.text20 = this.add.text(this.game.width + 160, this.game.height - 100, 'Nothing seems right...', this.style);
            this.text20.anchor.setTo(0.5, 0.5);
            this.text21 = this.add.text(-160, this.game.height - 70, '...and everything feels wrong', this.style);
            this.text21.anchor.setTo(0.5, 0.5);

            this.add.tween(this.text20).to({ x: this.game.world.centerX + 20 }, 750, Phaser.Easing.Exponential.In, true, 500);
            this.add.tween(this.text21).to({ x: this.game.world.centerX - 20 }, 750, Phaser.Easing.Exponential.In, true, 1000).onComplete.addOnce(this.storyLine9, this);
        };

        Level1.prototype.storyLine9 = function () {
            this.add.tween(this.text20).to({ x: -160 }, 750, Phaser.Easing.Exponential.In, true, 3500);
            this.add.tween(this.text21).to({ x: this.game.width + 160 }, 750, Phaser.Easing.Exponential.In, true, 4500).onComplete.addOnce(this.storyLine10, this);
        };

        Level1.prototype.storyLine10 = function () {
            this.text22 = this.add.text(50, this.game.height - 100, 'Oh well...', this.style);
            this.text23 = this.add.text(50, this.game.height - 70, '...at least i tried.', this.style);
            this.text24 = this.add.text(50, this.game.height - 40, 'ENJOY!', this.style);
            this.text22.alpha = 0;
            this.text23.alpha = 0;
            this.text24.alpha = 0;

            this.add.tween(this.text22).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.text23).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.text24).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.addOnce(this.storyLine11, this);
        };

        Level1.prototype.storyLine11 = function () {
            this.add.tween(this.text22).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 3000);
            this.add.tween(this.text23).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 3500);
            this.add.tween(this.text24).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 4000);
        };
        return Level1;
    })(Phaser.State);
    Game4.Level1 = Level1;
})(Game4 || (Game4 = {}));
var Game4;
(function (Game4) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'player', 0);

            game.add.existing(this);
        }
        Player.prototype.updatePlayer = function () {
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.x >= 456) {
                this.x = 456;
            }
        };
        return Player;
    })(Phaser.Sprite);
    Game4.Player = Player;
})(Game4 || (Game4 = {}));
var Game4;
(function (Game4) {
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
            this.load.image('icon_volume', 'assets/icon_volume.png');
            this.load.image('icon_volume_hover', 'assets/icon_volume_hover.png');
            this.load.image('player', 'assets/player.png');
            this.load.image('box', 'assets/box.png');
            this.load.image('bullet', 'assets/bullet.png');
            this.load.image('lose_box', 'assets/lose_box.png');
            this.load.image('creativity', 'assets/creativity.png');

            //this.load.spritesheet('bullets', 'assets/bullets.png', 7, 23);
            this.load.audio('box_kill', 'assets/sound/box_kill.wav', true);
            this.load.audio('fire', 'assets/sound/fire.wav', true);
            this.load.audio('music', 'assets/sound/Desperate Attempt to Uplift.mp3', true);
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
            this.game.state.start('Start', true, false);
        };
        return Preloader;
    })(Phaser.State);
    Game4.Preloader = Preloader;
})(Game4 || (Game4 = {}));
var Game4;
(function (Game4) {
    var Start = (function (_super) {
        __extends(Start, _super);
        function Start() {
            _super.apply(this, arguments);
        }
        Start.prototype.create = function () {
            this.sound.stopAll();

            //Intro
            this.titleText = this.add.text(this.world.centerX, this.world.centerY - 150, "Endless Waves of Boxes", { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.titleText.anchor.setTo(0.5, 0.5);
            this.introText = this.add.text(this.world.centerX, this.world.centerY, "Press space to start", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
            this.instructionsText = this.add.text(this.world.centerX, this.world.centerY + 200, "Arrows to move; Space to shoot", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.instructionsText.anchor.setTo(0.5, 0.5);

            this.box = this.add.sprite(-50, -50, "box");
            this.box.anchor.setTo(0.5, 0.5);

            this.time.events.loop(500, this.randomBoxes, this);
        };

        Start.prototype.update = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.game.state.start('Level1');
            }
        };

        Start.prototype.randomBoxes = function () {
            this.box = this.add.sprite(-50, -50, "box");
            this.box.anchor.setTo(0.5, 0.5);

            var x = 0;
            var y = 0;
            var tweenX = 0;
            var tweenY = 0;

            var rnd = this.game.rnd.integerInRange(0, 4);
            if (rnd == 0) {
                x = this.game.rnd.integerInRange(0, this.game.width);
                y = (this.box.height / 2 + 2);
                tweenX = this.game.rnd.integerInRange(0, this.game.width);
                tweenY = this.game.height + this.box.height;
            } else if (rnd == 1) {
                x = this.game.rnd.integerInRange(0, this.game.width);
                y = (this.box.height / 2 - 2);
                tweenX = this.game.rnd.integerInRange(0, this.game.width);
                tweenY = -this.box.height;
            } else if (rnd == 2) {
                x = -(this.box.width / 2 + 2);
                y = this.game.rnd.integerInRange(0, this.game.height);
                tweenX = this.game.width + this.box.width;
                tweenY = this.game.rnd.integerInRange(0, this.game.height);
            } else if (rnd == 3) {
                x = this.game.width + (this.box.width / 2 - 2);
                y = this.game.rnd.integerInRange(0, this.game.height);
                tweenX = -this.box.width;
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

            this.box.reset(x, y);
            this.box.angle = 90 + Math.atan2(y - tweenX, x - tweenY) * 180 / Math.PI;

            var tween = this.game.add.tween(this.box).to({ x: tweenX, y: tweenY }, this.game.rnd.integerInRange(1000, 4000), Phaser.Easing.Linear.None, true, this.game.rnd.integerInRange(200, 1000));
            this.game.add.tween(this.box).to({ angle: 360 }, this.game.rnd.integerInRange(2000, 4000), Phaser.Easing.Linear.None, true, 0, true);

            tween.onComplete.add(this.dest, this);
        };

        Start.prototype.dest = function () {
            this.box.kill();
        };
        return Start;
    })(Phaser.State);
    Game4.Start = Start;
})(Game4 || (Game4 = {}));
var Game4;
(function (Game4) {
    var Victory = (function (_super) {
        __extends(Victory, _super);
        function Victory() {
            _super.apply(this, arguments);
        }
        Victory.prototype.create = function () {
            this.sound.stopAll();

            this.victoryText = this.add.text(this.world.centerX, this.world.centerY - 150, "Victory", { font: "26px Chunk", fill: "#ffffff", align: "center" });
            this.victoryText.anchor.setTo(0.5, 0.5);

            this.introText = this.add.text(this.world.centerX, this.world.centerY + 100, "Press R to play again", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
        };

        Victory.prototype.update = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                this.game.state.start('Start');
            }
        };
        return Victory;
    })(Phaser.State);
    Game4.Victory = Victory;
})(Game4 || (Game4 = {}));
var Game4;
(function (Game4) {
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
    Game4.Volume = Volume;
})(Game4 || (Game4 = {}));
//# sourceMappingURL=Game.js.map
