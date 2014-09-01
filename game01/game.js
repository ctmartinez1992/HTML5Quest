window.onload = function () {
    var game = new Game1.Game();
};
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game1;
(function (Game1) {
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
            this.stage.backgroundColor = '#333333';

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
    Game1.Boot = Boot;
})(Game1 || (Game1 = {}));
var Game1;
(function (Game1) {
    var EnemyImpossible = (function (_super) {
        __extends(EnemyImpossible, _super);
        function EnemyImpossible(game, top, bot, x, y, speed) {
            _super.call(this, game, x, y, 'pad_enemy_impossible', 0);

            this.top = top;
            this.bot = bot;
            this.speed = speed;
            this.firstSpeed = speed;

            this.anchor.setTo(0.5, 0.5);

            game.add.existing(this);
        }
        EnemyImpossible.prototype.updateEnemy = function () {
            this.body.x = 725;
        };

        EnemyImpossible.prototype.moveUp = function (y) {
            if (!this.game.physics.collide(this, this.top, null, null, this)) {
                this.body.y += -this.speed;
            }
        };

        EnemyImpossible.prototype.moveDown = function (y) {
            if (!this.game.physics.collide(this, this.bot, null, null, this)) {
                this.body.y += this.speed;
            }
        };

        EnemyImpossible.prototype.resetEnemy = function () {
            this.body.x = 725;
            this.body.y = this.game.world.centerY - this.height / 2;
            this.speed = this.firstSpeed;
        };
        return EnemyImpossible;
    })(Phaser.Sprite);
    Game1.EnemyImpossible = EnemyImpossible;
})(Game1 || (Game1 = {}));
var Game1;
(function (Game1) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 600, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Game1.Boot, false);
            this.state.add('Preloader', Game1.Preloader, false);
            this.state.add('MainMenu', Game1.MainMenu, false);
            this.state.add('PlayMenu', Game1.PlayMenu, false);
            this.state.add('LevelEasy', Game1.LevelEasy, false);
            this.state.add('LevelNormal', Game1.LevelNormal, false);
            this.state.add('LevelHard', Game1.LevelHard, false);
            this.state.add('LevelImpossible', Game1.LevelImpossible, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Game1.Game = Game;
})(Game1 || (Game1 = {}));
var Game1;
(function (Game1) {
    var LevelImpossible = (function (_super) {
        __extends(LevelImpossible, _super);
        function LevelImpossible() {
            _super.apply(this, arguments);
            this.PLAYER_SPEED = 2;
            this.ENEMY_SPEED = 5;
            this.BALL_SPEED = 10;
        }
        LevelImpossible.prototype.create = function () {
            //Volume icon
            this.iconVolume = this.add.sprite(20, this.world.height - 70, 'icon_volume');
            this.iconVolume.inputEnabled = true;
            this.iconVolume.events.onInputDown.add(this.clickVolume, this);
            this.iconVolumeHover = this.add.sprite(20, this.world.height - 70, 'icon_volume_hover');
            this.iconVolumeHover.inputEnabled = true;
            this.iconVolumeHover.events.onInputDown.add(this.clickVolume, this);
            this.iconVolumeHover.visible = false;

            //Field
            this.lateralLeft = this.add.sprite(0, 0, 'field_laterals');
            this.lateralRight = this.add.sprite(790, 0, 'field_laterals');
            this.lateralTop = this.add.sprite(0, 0, 'field_verticals');
            this.lateralBot = this.add.sprite(0, 590, 'field_verticals');

            this.lateralLeft.fixedToCamera = true;
            this.lateralRight.fixedToCamera = true;
            this.lateralTop.fixedToCamera = true;
            this.lateralBot.fixedToCamera = true;

            //Countdown
            this.countdownText = this.add.text(this.world.centerX, this.world.centerY, "", { font: "64px Chunk", fill: "#ffffff", align: "center" });
            this.countdownText.anchor.setTo(0.5, 0.5);
            this.countdownTimer = 0;
            this.doCountdown = true;

            //Scores
            this.playerScoreN = 0;
            this.playerScore = this.add.text(this.world.centerX - 40, 50, this.playerScoreN + "", { font: "48px Chunk", fill: "#ffffff", align: "center" });
            this.playerScore.anchor.setTo(0.5, 0.5);
            this.enemyScoreN = 0;
            this.enemyScore = this.add.text(this.world.centerX + 40, 50, this.enemyScoreN + "", { font: "48px Chunk", fill: "#ffffff", align: "center" });
            this.enemyScore.anchor.setTo(0.5, 0.5);

            //Win text
            this.letterW = this.add.sprite(233, -100, 'win_w');
            this.letterW.anchor.setTo(0.5, 0.5);
            this.letterI = this.add.sprite(303, -100, 'win_i');
            this.letterI.anchor.setTo(0.5, 0.5);
            this.letterN = this.add.sprite(363, -100, 'win_n');
            this.letterN.anchor.setTo(0.5, 0.5);
            this.letterN2 = this.add.sprite(441, -100, 'win_n');
            this.letterN2.anchor.setTo(0.5, 0.5);
            this.letterE = this.add.sprite(513, -100, 'win_e');
            this.letterE.anchor.setTo(0.5, 0.5);
            this.letterR = this.add.sprite(583, -100, 'win_r');
            this.letterR.anchor.setTo(0.5, 0.5);

            //Lose text
            this.gameOver = this.add.sprite(this.world.centerX, this.world.centerY - 150, 'game_over');
            this.gameOver.anchor.setTo(0.5, 0.5);
            this.gameOver.alpha = 0;

            //Sound
            this.beep1 = this.add.audio('beep1', 1, false);
            this.beep23 = this.add.audio('beep32', 1, false);
            this.hitWall = this.add.audio('hit_wall', 1, false);
            this.hitPad = this.add.audio('hit_pad', 1, false);
            this.playerPoint = this.add.audio('player_point', 1, false);
            this.enemyPoint = this.add.audio('enemy_point', 1, false);
            this.winSound = this.add.audio('win', 1, false);
            this.loseSound = this.add.audio('lose', 1, false);
            this.laugh = this.add.audio('laugh', 0.5, false);
            this.elevator = this.add.audio('elevator', 0.5, true);
            this.music = this.add.audio('the_big_game', 0.5, true);

            this.time.events.add(10000, this.playLaugh, this);
            this.elevator.play('', 0, 0.5, true);
            this.elevator.pause();
            this.music.play('', 0, 0.5, true);
            this.music.pause();

            //Player, enemy and the ball
            this.player = new Game1.Player(this.game, this.lateralTop, this.lateralBot, 50, this.world.centerY, this.PLAYER_SPEED);
            this.enemy = new Game1.EnemyImpossible(this.game, this.lateralTop, this.lateralBot, 725, this.world.centerY, this.ENEMY_SPEED);
            this.ball = new Game1.Ball(this.game, this.game.world.centerX, this.game.world.centerY, this.BALL_SPEED, Math.PI);

            //Pause key
            this.pauseButton = this.input.keyboard.addKey(Phaser.Keyboard.P);
            this.pauseButton.onDown.add(this.pauseGame, this);
            this.pauseText = this.add.text(this.world.centerX, this.world.centerY, "PAUSED", { font: "64px Chunk", fill: "#ffffff", align: "center" });
            this.pauseText.anchor.setTo(0.5, 0.5);
            this.pauseText.visible = false;

            //Endgame buttons
            this.btnMainmenu = this.add.button(this.world.centerX, this.world.centerY + 90, 'btn_mainmenu', this.mainmenuClick, this, 1, 0, 2);
            this.btnMainmenu.anchor.setTo(0.5, 0.5);
            this.btnMainmenu.alpha = 0;

            this.btnRestart = this.add.button(this.world.centerX, this.world.centerY, 'btn_restart', this.restartClick, this, 1, 0, 2);
            this.btnRestart.anchor.setTo(0.5, 0.5);
            this.btnRestart.alpha = 0;

            //Win and lose limits
            this.playerWinCondition = 3;
            this.enemyWinCondition = 3;

            //Booleans
            this.doUpdate = false;
            this.won = false;
            this.lost = false;

            //Controls the sound of the countdown, probably a cheap way to do it
            this.play3 = true;
            this.play2 = true;
            this.play1 = true;

            //Checks if the game is muted
            this.mute = false;
        };

        LevelImpossible.prototype.update = function () {
            if (this.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.music.stop();
                this.elevator.stop();
                this.game.state.start('MainMenu', true, false);
            }

            //Do the countdown
            if (this.doCountdown) {
                this.countdown();
            }

            //Update the game
            if (this.doUpdate && !this.won && !this.lost) {
                this.ball.updateBall();

                this.player.updatePlayer();
                this.enemy.updateEnemy();

                //Vertical collision
                this.physics.collide(this.ball, this.lateralTop, this.ballCollisionVertical, null, this);
                this.physics.collide(this.ball, this.lateralBot, this.ballCollisionVertical, null, this);

                //Horizontal collision
                this.physics.collide(this.ball, this.lateralRight, this.ballCollisionPlayerPoint, null, this);
                this.physics.collide(this.ball, this.lateralLeft, this.ballCollisionEnemyPoint, null, this);

                //Pad collision
                this.physics.collide(this.ball, this.player, this.ballCollisionPlayer, null, this);
                this.physics.collide(this.ball, this.enemy, this.ballCollisionEnemy, null, this);

                //AI
                if (this.ball.y < this.enemy.y) {
                    this.enemy.moveUp(this.ball.y);
                } else if (this.ball.y > this.enemy.y) {
                    this.enemy.moveDown(this.ball.y);
                }
            }
        };

        LevelImpossible.prototype.countdown = function () {
            this.countdownTimer += this.game.time.elapsed;
            if (this.countdownTimer > 250 && this.countdownTimer <= 750) {
                this.countdownText.content = "3";
                if (this.play3) {
                    this.beep23.play();
                    this.play3 = false;
                }
            } else if (this.countdownTimer > 750 && this.countdownTimer <= 1250) {
                this.countdownText.content = "";
            } else if (this.countdownTimer > 1250 && this.countdownTimer <= 1750) {
                this.countdownText.content = "2";
                if (this.play2) {
                    this.beep23.play();
                    this.play2 = false;
                }
            } else if (this.countdownTimer > 1750 && this.countdownTimer <= 2250) {
                this.countdownText.content = "";
            } else if (this.countdownTimer > 2250 && this.countdownTimer <= 2750) {
                this.countdownText.content = "1";
                if (this.play1) {
                    this.beep1.play();
                    this.play1 = false;
                }
            } else if (this.countdownTimer > 2750) {
                this.countdownText.content = "";
                this.countdownTimer = 0;
                this.doCountdown = false;
                this.doUpdate = true;

                this.play1 = true;
                this.play2 = true;
                this.play3 = true;

                if (!this.music.isPlaying) {
                    this.music.resume();
                }
            }
        };

        LevelImpossible.prototype.ballCollisionVertical = function () {
            this.ball.dir = -this.ball.dir;
            this.hitWall.play();
        };

        LevelImpossible.prototype.ballCollisionPlayer = function () {
            //Change angle of the ball, it's influenced by the hit location of the pad
            var distance = this.player.y - this.ball.y;
            this.ball.dir = Math.PI - this.ball.dir - ((distance * 0.3) * (Math.PI) / 180);

            //Accelerate the ball and the pad
            this.ball.vel += 0.1;
            if (this.ball.vel >= this.BALL_SPEED * 2) {
                this.ball.vel = this.BALL_SPEED * 2;
            }
            this.player.speed += 0.1;
            if (this.player.speed >= this.PLAYER_SPEED * 2) {
                this.player.speed = this.PLAYER_SPEED * 2;
            }

            this.hitPad.play();
        };

        LevelImpossible.prototype.ballCollisionEnemy = function () {
            //Change angle of the ball, it's influenced by the hit location of the pad
            var distance = this.enemy.y - this.ball.y;
            this.ball.dir = Math.PI - this.ball.dir + ((distance * 0.3) * (Math.PI) / 180);

            //Accelerate the ball and the pad
            this.ball.vel += 0.1;
            if (this.ball.vel >= this.BALL_SPEED * 2) {
                this.ball.vel = this.BALL_SPEED * 2;
            }
            this.enemy.speed += 0.1;
            if (this.enemy.speed >= this.ENEMY_SPEED * 2) {
                this.enemy.speed = this.ENEMY_SPEED * 2;
            }

            this.hitPad.play();
        };

        LevelImpossible.prototype.ballCollisionPlayerPoint = function () {
            //Set the score
            this.playerScoreN += 1;
            this.playerScore.content = this.playerScoreN + "";
            this.playerScore.anchor.setTo(0.5, 0.5);

            //Reset board
            this.boardReset(0);

            //Win condition
            if (this.playerScoreN == this.playerWinCondition) {
                this.won = true;
                this.animateWinnerAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.winSound.play();
            }

            //Lose condition
            if (this.enemyScoreN == this.enemyWinCondition) {
                this.lost = true;
                this.animateLoserAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.loseSound.play();
            }

            if (this.playerScoreN != this.playerWinCondition && this.enemyScoreN != this.enemyWinCondition) {
                this.playerPoint.play();
            }
        };

        LevelImpossible.prototype.ballCollisionEnemyPoint = function () {
            //Set the score
            this.enemyScoreN += 1;
            this.enemyScore.content = this.enemyScoreN + "";
            this.enemyScore.anchor.setTo(0.5, 0.5);

            //Reset board
            this.boardReset(Math.PI);

            //Win condition
            if (this.playerScoreN == this.playerWinCondition) {
                this.won = true;
                this.animateWinnerAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.winSound.play();
            }

            //Lose condition
            if (this.enemyScoreN == this.enemyWinCondition) {
                this.lost = true;
                this.animateLoserAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.loseSound.play();
            }

            if (this.playerScoreN != this.playerWinCondition && this.enemyScoreN != this.enemyWinCondition) {
                this.enemyPoint.play();
            }
        };

        LevelImpossible.prototype.mainmenuClick = function () {
            this.game.state.start('MainMenu', true, false);
        };

        LevelImpossible.prototype.restartClick = function () {
            this.playerScoreN = 0;
            this.playerScore.content = this.playerScoreN + "";
            this.playerScore.anchor.setTo(0.5, 0.5);
            this.enemyScoreN = 0;
            this.enemyScore.content = this.enemyScoreN + "";
            this.enemyScore.anchor.setTo(0.5, 0.5);

            if (this.won) {
                this.add.tween(this.letterW).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 0, false);
                this.add.tween(this.letterI).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 250, false);
                this.add.tween(this.letterN).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 500, false);
                this.add.tween(this.letterN2).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 750, false);
                this.add.tween(this.letterE).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1000, false);
                this.add.tween(this.letterR).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1250, false);

                this.add.tween(this.btnRestart).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.btnMainmenu).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 750);
            }

            if (this.lost) {
                this.add.tween(this.gameOver).to({ alpha: 0 }, 1000, Phaser.Easing.Circular.In, true, 0, false);

                this.add.tween(this.btnRestart).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.btnMainmenu).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 750);
            }

            this.won = false;
            this.lost = false;
            this.doCountdown = true;

            this.music.stop();
            this.elevator.stop();
            this.music.play('', 0, 0.5, true);
            this.elevator.play('', 0, 0.5, true);
            this.music.pause();
            this.elevator.pause();
        };

        LevelImpossible.prototype.boardReset = function (dir) {
            this.player.resetPlayer();
            this.enemy.resetEnemy();
            this.ball.resetBall(dir);
            this.doCountdown = !(this.playerScoreN >= this.playerWinCondition || this.enemyScoreN >= this.enemyWinCondition);
            this.doUpdate = false;
        };

        LevelImpossible.prototype.animateWinnerAndButtons = function () {
            this.add.tween(this.letterW).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 500, false);
            this.add.tween(this.letterW).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 500, false);

            this.add.tween(this.letterI).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 1000, false);
            this.add.tween(this.letterI).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 1000, false);

            this.add.tween(this.letterN).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 1500, false);
            this.add.tween(this.letterN).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 1500, false);

            this.add.tween(this.letterN2).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 2000, false);
            this.add.tween(this.letterN2).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 2000, false);

            this.add.tween(this.letterE).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 2500, false);
            this.add.tween(this.letterE).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 2500, false);

            this.add.tween(this.letterR).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 3000, false);
            this.add.tween(this.letterR).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 3000, false);

            this.add.tween(this.btnRestart).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 3250);
            this.add.tween(this.btnMainmenu).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 3500);
        };

        LevelImpossible.prototype.animateLoserAndButtons = function () {
            this.add.tween(this.gameOver).to({ alpha: 1 }, 1500, Phaser.Easing.Elastic.InOut, true, 500, false);

            this.add.tween(this.btnRestart).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1000);
            this.add.tween(this.btnMainmenu).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1250);

            this.add.tween(this.gameOver).to({ alpha: 0.2 }, 1500, Phaser.Easing.Cubic.In, true, 1500, false);
            this.add.tween(this.gameOver).to({ alpha: 1 }, 1500, Phaser.Easing.Cubic.In, true, 3000, false);
        };

        LevelImpossible.prototype.pauseGame = function () {
            if (!this.won && !this.lost) {
                this.doUpdate = !this.doUpdate;
                this.pauseText.visible = !this.doUpdate;

                if (this.pauseText.visible) {
                    if (this.music.isPlaying) {
                        this.music.pause();
                    }
                    if (!this.elevator.isPlaying) {
                        this.elevator.resume();
                    }
                } else {
                    if (!this.music.isPlaying) {
                        this.music.resume();
                    }
                    if (this.elevator.isPlaying) {
                        this.elevator.pause();
                    }
                }
            }
        };

        LevelImpossible.prototype.clickVolume = function () {
            this.mute = !this.mute;
            this.sound.mute = this.mute;
            this.iconVolumeHover.visible = this.mute;
            this.iconVolume.visible = !this.iconVolumeHover.visible;
        };

        LevelImpossible.prototype.playLaugh = function () {
            this.laugh.play();
        };
        return LevelImpossible;
    })(Phaser.State);
    Game1.LevelImpossible = LevelImpossible;
})(Game1 || (Game1 = {}));
var Game1;
(function (Game1) {
    var LevelNormal = (function (_super) {
        __extends(LevelNormal, _super);
        function LevelNormal() {
            _super.apply(this, arguments);
            this.PLAYER_SPEED = 2;
            this.ENEMY_SPEED = 2;
            this.BALL_SPEED = 6;
        }
        LevelNormal.prototype.create = function () {
            //Volume icon
            this.iconVolume = this.add.sprite(20, this.world.height - 70, 'icon_volume');
            this.iconVolume.inputEnabled = true;
            this.iconVolume.events.onInputDown.add(this.clickVolume, this);
            this.iconVolumeHover = this.add.sprite(20, this.world.height - 70, 'icon_volume_hover');
            this.iconVolumeHover.inputEnabled = true;
            this.iconVolumeHover.events.onInputDown.add(this.clickVolume, this);
            this.iconVolumeHover.visible = false;

            //Field
            this.lateralLeft = this.add.sprite(0, 0, 'field_laterals');
            this.lateralRight = this.add.sprite(790, 0, 'field_laterals');
            this.lateralTop = this.add.sprite(0, 0, 'field_verticals');
            this.lateralBot = this.add.sprite(0, 590, 'field_verticals');

            this.lateralLeft.fixedToCamera = true;
            this.lateralRight.fixedToCamera = true;
            this.lateralTop.fixedToCamera = true;
            this.lateralBot.fixedToCamera = true;

            //Countdown
            this.countdownText = this.add.text(this.world.centerX, this.world.centerY, "", { font: "64px Chunk", fill: "#ffffff", align: "center" });
            this.countdownText.anchor.setTo(0.5, 0.5);
            this.countdownTimer = 0;
            this.doCountdown = true;

            //Scores
            this.playerScoreN = 0;
            this.playerScore = this.add.text(this.world.centerX - 40, 50, this.playerScoreN + "", { font: "48px Chunk", fill: "#ffffff", align: "center" });
            this.playerScore.anchor.setTo(0.5, 0.5);
            this.enemyScoreN = 0;
            this.enemyScore = this.add.text(this.world.centerX + 40, 50, this.enemyScoreN + "", { font: "48px Chunk", fill: "#ffffff", align: "center" });
            this.enemyScore.anchor.setTo(0.5, 0.5);

            //Win text
            this.letterW = this.add.sprite(233, -100, 'win_w');
            this.letterW.anchor.setTo(0.5, 0.5);
            this.letterI = this.add.sprite(303, -100, 'win_i');
            this.letterI.anchor.setTo(0.5, 0.5);
            this.letterN = this.add.sprite(363, -100, 'win_n');
            this.letterN.anchor.setTo(0.5, 0.5);
            this.letterN2 = this.add.sprite(441, -100, 'win_n');
            this.letterN2.anchor.setTo(0.5, 0.5);
            this.letterE = this.add.sprite(513, -100, 'win_e');
            this.letterE.anchor.setTo(0.5, 0.5);
            this.letterR = this.add.sprite(583, -100, 'win_r');
            this.letterR.anchor.setTo(0.5, 0.5);

            //Lose text
            this.gameOver = this.add.sprite(this.world.centerX, this.world.centerY - 150, 'game_over');
            this.gameOver.anchor.setTo(0.5, 0.5);
            this.gameOver.alpha = 0;

            //Sound
            this.beep1 = this.add.audio('beep1', 1, false);
            this.beep23 = this.add.audio('beep32', 1, false);
            this.hitWall = this.add.audio('hit_wall', 1, false);
            this.hitPad = this.add.audio('hit_pad', 1, false);
            this.playerPoint = this.add.audio('player_point', 1, false);
            this.enemyPoint = this.add.audio('enemy_point', 1, false);
            this.winSound = this.add.audio('win', 1, false);
            this.loseSound = this.add.audio('lose', 1, false);
            this.elevator = this.add.audio('elevator', 0.5, true);
            this.music = this.add.audio('the_big_game', 0.5, true);
            this.elevator.play('', 0, 0.5, true);
            this.elevator.pause();
            this.music.play('', 0, 0.5, true);
            this.music.pause();

            //Player, enemy and the ball
            this.player = new Game1.Player(this.game, this.lateralTop, this.lateralBot, 50, this.world.centerY, this.PLAYER_SPEED);
            this.enemy = new Game1.Enemy(this.game, this.lateralTop, this.lateralBot, 750, this.world.centerY, this.ENEMY_SPEED);
            this.ball = new Game1.Ball(this.game, this.game.world.centerX, this.game.world.centerY, this.BALL_SPEED, Math.PI);

            //Pause key
            this.pauseButton = this.input.keyboard.addKey(Phaser.Keyboard.P);
            this.pauseButton.onDown.add(this.pauseGame, this);
            this.pauseText = this.add.text(this.world.centerX, this.world.centerY, "PAUSED", { font: "64px Chunk", fill: "#ffffff", align: "center" });
            this.pauseText.anchor.setTo(0.5, 0.5);
            this.pauseText.visible = false;

            //Endgame buttons
            this.btnMainmenu = this.add.button(this.world.centerX, this.world.centerY + 90, 'btn_mainmenu', this.mainmenuClick, this, 1, 0, 2);
            this.btnMainmenu.anchor.setTo(0.5, 0.5);
            this.btnMainmenu.alpha = 0;

            this.btnRestart = this.add.button(this.world.centerX, this.world.centerY, 'btn_restart', this.restartClick, this, 1, 0, 2);
            this.btnRestart.anchor.setTo(0.5, 0.5);
            this.btnRestart.alpha = 0;

            //Win and lose limits
            this.playerWinCondition = 3;
            this.enemyWinCondition = 3;

            //Booleans
            this.doUpdate = false;
            this.won = false;
            this.lost = false;

            //Controls the sound of the countdown, probably a cheap way to do it
            this.play3 = true;
            this.play2 = true;
            this.play1 = true;

            //Checks if the game is muted
            this.mute = false;
        };

        LevelNormal.prototype.update = function () {
            if (this.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.music.stop();
                this.elevator.stop();
                this.game.state.start('MainMenu', true, false);
            }

            //Do the countdown
            if (this.doCountdown) {
                this.countdown();
            }

            //Update the game
            if (this.doUpdate && !this.won && !this.lost) {
                this.ball.updateBall();

                this.player.updatePlayer();
                this.enemy.updateEnemy();

                //Vertical collision
                this.physics.collide(this.ball, this.lateralTop, this.ballCollisionVertical, null, this);
                this.physics.collide(this.ball, this.lateralBot, this.ballCollisionVertical, null, this);

                //Horizontal collision
                this.physics.collide(this.ball, this.lateralRight, this.ballCollisionPlayerPoint, null, this);
                this.physics.collide(this.ball, this.lateralLeft, this.ballCollisionEnemyPoint, null, this);

                //Pad collision
                this.physics.collide(this.ball, this.player, this.ballCollisionPlayer, null, this);
                this.physics.collide(this.ball, this.enemy, this.ballCollisionEnemy, null, this);

                //AI
                if (this.ball.y < this.enemy.y) {
                    this.enemy.moveUp(this.ball.y);
                } else if (this.ball.y > this.enemy.y) {
                    this.enemy.moveDown(this.ball.y);
                }
            }
        };

        LevelNormal.prototype.countdown = function () {
            this.countdownTimer += this.game.time.elapsed;
            if (this.countdownTimer > 250 && this.countdownTimer <= 750) {
                this.countdownText.content = "3";
                if (this.play3) {
                    this.beep23.play();
                    this.play3 = false;
                }
            } else if (this.countdownTimer > 750 && this.countdownTimer <= 1250) {
                this.countdownText.content = "";
            } else if (this.countdownTimer > 1250 && this.countdownTimer <= 1750) {
                this.countdownText.content = "2";
                if (this.play2) {
                    this.beep23.play();
                    this.play2 = false;
                }
            } else if (this.countdownTimer > 1750 && this.countdownTimer <= 2250) {
                this.countdownText.content = "";
            } else if (this.countdownTimer > 2250 && this.countdownTimer <= 2750) {
                this.countdownText.content = "1";
                if (this.play1) {
                    this.beep1.play();
                    this.play1 = false;
                }
            } else if (this.countdownTimer > 2750) {
                this.countdownText.content = "";
                this.countdownTimer = 0;
                this.doCountdown = false;
                this.doUpdate = true;

                this.play1 = true;
                this.play2 = true;
                this.play3 = true;

                if (!this.music.isPlaying) {
                    this.music.resume();
                }
            }
        };

        LevelNormal.prototype.ballCollisionVertical = function () {
            this.ball.dir = -this.ball.dir;
            this.hitWall.play();
        };

        LevelNormal.prototype.ballCollisionPlayer = function () {
            //Change angle of the ball, it's influenced by the hit location of the pad
            var distance = this.player.y - this.ball.y;
            this.ball.dir = Math.PI - this.ball.dir - ((distance * 0.3) * (Math.PI) / 180);

            //Accelerate the ball and the pad
            this.ball.vel += 0.1;
            if (this.ball.vel >= this.BALL_SPEED * 2) {
                this.ball.vel = this.BALL_SPEED * 2;
            }
            this.player.speed += 0.1;
            if (this.player.speed >= this.PLAYER_SPEED * 2) {
                this.player.speed = this.PLAYER_SPEED * 2;
            }

            this.hitPad.play();
        };

        LevelNormal.prototype.ballCollisionEnemy = function () {
            //Change angle of the ball, it's influenced by the hit location of the pad
            var distance = this.enemy.y - this.ball.y;
            this.ball.dir = Math.PI - this.ball.dir + ((distance * 0.3) * (Math.PI) / 180);

            //Accelerate the ball and the pad
            this.ball.vel += 0.1;
            if (this.ball.vel >= this.BALL_SPEED * 2) {
                this.ball.vel = this.BALL_SPEED * 2;
            }
            this.enemy.speed += 0.1;
            if (this.enemy.speed >= this.ENEMY_SPEED * 2) {
                this.enemy.speed = this.ENEMY_SPEED * 2;
            }

            this.hitPad.play();
        };

        LevelNormal.prototype.ballCollisionPlayerPoint = function () {
            //Set the score
            this.playerScoreN += 1;
            this.playerScore.content = this.playerScoreN + "";
            this.playerScore.anchor.setTo(0.5, 0.5);

            //Reset board
            this.boardReset(0);

            //Win condition
            if (this.playerScoreN == this.playerWinCondition) {
                this.won = true;
                this.animateWinnerAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.winSound.play();
            }

            //Lose condition
            if (this.enemyScoreN == this.enemyWinCondition) {
                this.lost = true;
                this.animateLoserAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.loseSound.play();
            }

            if (this.playerScoreN != this.playerWinCondition && this.enemyScoreN != this.enemyWinCondition) {
                this.playerPoint.play();
            }
        };

        LevelNormal.prototype.ballCollisionEnemyPoint = function () {
            //Set the score
            this.enemyScoreN += 1;
            this.enemyScore.content = this.enemyScoreN + "";
            this.enemyScore.anchor.setTo(0.5, 0.5);

            //Reset board
            this.boardReset(Math.PI);

            //Win condition
            if (this.playerScoreN == this.playerWinCondition) {
                this.won = true;
                this.animateWinnerAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.winSound.play();
            }

            //Lose condition
            if (this.enemyScoreN == this.enemyWinCondition) {
                this.lost = true;
                this.animateLoserAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.loseSound.play();
            }

            if (this.playerScoreN != this.playerWinCondition && this.enemyScoreN != this.enemyWinCondition) {
                this.enemyPoint.play();
            }
        };

        LevelNormal.prototype.mainmenuClick = function () {
            this.game.state.start('MainMenu', true, false);
        };

        LevelNormal.prototype.restartClick = function () {
            this.playerScoreN = 0;
            this.playerScore.content = this.playerScoreN + "";
            this.playerScore.anchor.setTo(0.5, 0.5);
            this.enemyScoreN = 0;
            this.enemyScore.content = this.enemyScoreN + "";
            this.enemyScore.anchor.setTo(0.5, 0.5);

            if (this.won) {
                this.add.tween(this.letterW).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 0, false);
                this.add.tween(this.letterI).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 250, false);
                this.add.tween(this.letterN).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 500, false);
                this.add.tween(this.letterN2).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 750, false);
                this.add.tween(this.letterE).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1000, false);
                this.add.tween(this.letterR).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1250, false);

                this.add.tween(this.btnRestart).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.btnMainmenu).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 750);
            }

            if (this.lost) {
                this.add.tween(this.gameOver).to({ alpha: 0 }, 1000, Phaser.Easing.Circular.In, true, 0, false);

                this.add.tween(this.btnRestart).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.btnMainmenu).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 750);
            }

            this.won = false;
            this.lost = false;
            this.doCountdown = true;

            this.music.stop();
            this.elevator.stop();
            this.music.play('', 0, 0.5, true);
            this.elevator.play('', 0, 0.5, true);
            this.music.pause();
            this.elevator.pause();
        };

        LevelNormal.prototype.boardReset = function (dir) {
            this.player.resetPlayer();
            this.enemy.resetEnemy();
            this.ball.resetBall(dir);
            this.doCountdown = !(this.playerScoreN >= this.playerWinCondition || this.enemyScoreN >= this.enemyWinCondition);
            this.doUpdate = false;
        };

        LevelNormal.prototype.animateWinnerAndButtons = function () {
            this.add.tween(this.letterW).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 500, false);
            this.add.tween(this.letterW).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 500, false);

            this.add.tween(this.letterI).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 1000, false);
            this.add.tween(this.letterI).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 1000, false);

            this.add.tween(this.letterN).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 1500, false);
            this.add.tween(this.letterN).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 1500, false);

            this.add.tween(this.letterN2).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 2000, false);
            this.add.tween(this.letterN2).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 2000, false);

            this.add.tween(this.letterE).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 2500, false);
            this.add.tween(this.letterE).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 2500, false);

            this.add.tween(this.letterR).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 3000, false);
            this.add.tween(this.letterR).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 3000, false);

            this.add.tween(this.btnRestart).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 3250);
            this.add.tween(this.btnMainmenu).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 3500);
        };

        LevelNormal.prototype.animateLoserAndButtons = function () {
            this.add.tween(this.gameOver).to({ alpha: 1 }, 1500, Phaser.Easing.Elastic.InOut, true, 500, false);

            this.add.tween(this.btnRestart).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1000);
            this.add.tween(this.btnMainmenu).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1250);

            this.add.tween(this.gameOver).to({ alpha: 0.2 }, 1500, Phaser.Easing.Cubic.In, true, 1500, false);
            this.add.tween(this.gameOver).to({ alpha: 1 }, 1500, Phaser.Easing.Cubic.In, true, 3000, false);
        };

        LevelNormal.prototype.pauseGame = function () {
            if (!this.won && !this.lost) {
                this.doUpdate = !this.doUpdate;
                this.pauseText.visible = !this.doUpdate;

                if (this.pauseText.visible) {
                    if (this.music.isPlaying) {
                        this.music.pause();
                    }
                    if (!this.elevator.isPlaying) {
                        this.elevator.resume();
                    }
                } else {
                    if (!this.music.isPlaying) {
                        this.music.resume();
                    }
                    if (this.elevator.isPlaying) {
                        this.elevator.pause();
                    }
                }
            }
        };

        LevelNormal.prototype.clickVolume = function () {
            this.mute = !this.mute;
            this.sound.mute = this.mute;
            this.iconVolumeHover.visible = this.mute;
            this.iconVolume.visible = !this.iconVolumeHover.visible;
        };
        return LevelNormal;
    })(Phaser.State);
    Game1.LevelNormal = LevelNormal;
})(Game1 || (Game1 = {}));
var Game1;
(function (Game1) {
    var LevelEasy = (function (_super) {
        __extends(LevelEasy, _super);
        function LevelEasy() {
            _super.apply(this, arguments);
            this.PLAYER_SPEED = 2;
            this.ENEMY_SPEED = 1.5;
            this.BALL_SPEED = 5;
        }
        LevelEasy.prototype.create = function () {
            //Volume icon
            this.iconVolume = this.add.sprite(20, this.world.height - 70, 'icon_volume');
            this.iconVolume.inputEnabled = true;
            this.iconVolume.events.onInputDown.add(this.clickVolume, this);
            this.iconVolumeHover = this.add.sprite(20, this.world.height - 70, 'icon_volume_hover');
            this.iconVolumeHover.inputEnabled = true;
            this.iconVolumeHover.events.onInputDown.add(this.clickVolume, this);
            this.iconVolumeHover.visible = false;

            //Field
            this.lateralLeft = this.add.sprite(0, 0, 'field_laterals');
            this.lateralRight = this.add.sprite(790, 0, 'field_laterals');
            this.lateralTop = this.add.sprite(0, 0, 'field_verticals');
            this.lateralBot = this.add.sprite(0, 590, 'field_verticals');

            this.lateralLeft.fixedToCamera = true;
            this.lateralRight.fixedToCamera = true;
            this.lateralTop.fixedToCamera = true;
            this.lateralBot.fixedToCamera = true;

            //Countdown
            this.countdownText = this.add.text(this.world.centerX, this.world.centerY, "", { font: "64px Chunk", fill: "#ffffff", align: "center" });
            this.countdownText.anchor.setTo(0.5, 0.5);
            this.countdownTimer = 0;
            this.doCountdown = true;

            //Scores
            this.playerScoreN = 0;
            this.playerScore = this.add.text(this.world.centerX - 40, 50, this.playerScoreN + "", { font: "48px Chunk", fill: "#ffffff", align: "center" });
            this.playerScore.anchor.setTo(0.5, 0.5);
            this.enemyScoreN = 0;
            this.enemyScore = this.add.text(this.world.centerX + 40, 50, this.enemyScoreN + "", { font: "48px Chunk", fill: "#ffffff", align: "center" });
            this.enemyScore.anchor.setTo(0.5, 0.5);

            //Win text
            this.letterW = this.add.sprite(233, -100, 'win_w');
            this.letterW.anchor.setTo(0.5, 0.5);
            this.letterI = this.add.sprite(303, -100, 'win_i');
            this.letterI.anchor.setTo(0.5, 0.5);
            this.letterN = this.add.sprite(363, -100, 'win_n');
            this.letterN.anchor.setTo(0.5, 0.5);
            this.letterN2 = this.add.sprite(441, -100, 'win_n');
            this.letterN2.anchor.setTo(0.5, 0.5);
            this.letterE = this.add.sprite(513, -100, 'win_e');
            this.letterE.anchor.setTo(0.5, 0.5);
            this.letterR = this.add.sprite(583, -100, 'win_r');
            this.letterR.anchor.setTo(0.5, 0.5);

            //Lose text
            this.gameOver = this.add.sprite(this.world.centerX, this.world.centerY - 150, 'game_over');
            this.gameOver.anchor.setTo(0.5, 0.5);
            this.gameOver.alpha = 0;

            //Sound
            this.beep1 = this.add.audio('beep1', 1, false);
            this.beep23 = this.add.audio('beep32', 1, false);
            this.hitWall = this.add.audio('hit_wall', 1, false);
            this.hitPad = this.add.audio('hit_pad', 1, false);
            this.playerPoint = this.add.audio('player_point', 1, false);
            this.enemyPoint = this.add.audio('enemy_point', 1, false);
            this.winSound = this.add.audio('win', 1, false);
            this.loseSound = this.add.audio('lose', 1, false);
            this.elevator = this.add.audio('elevator', 0.5, true);
            this.music = this.add.audio('the_big_game', 0.5, true);
            this.elevator.play('', 0, 0.5, true);
            this.elevator.pause();
            this.music.play('', 0, 0.5, true);
            this.music.pause();

            //Player, enemy and the ball
            this.player = new Game1.Player(this.game, this.lateralTop, this.lateralBot, 50, this.world.centerY, this.PLAYER_SPEED);
            this.enemy = new Game1.Enemy(this.game, this.lateralTop, this.lateralBot, 750, this.world.centerY, this.ENEMY_SPEED);
            this.ball = new Game1.Ball(this.game, this.game.world.centerX, this.game.world.centerY, this.BALL_SPEED, Math.PI);

            //Pause key
            this.pauseButton = this.input.keyboard.addKey(Phaser.Keyboard.P);
            this.pauseButton.onDown.add(this.pauseGame, this);
            this.pauseText = this.add.text(this.world.centerX, this.world.centerY, "PAUSED", { font: "64px Chunk", fill: "#ffffff", align: "center" });
            this.pauseText.anchor.setTo(0.5, 0.5);
            this.pauseText.visible = false;

            //Endgame buttons
            this.btnMainmenu = this.add.button(this.world.centerX, this.world.centerY + 90, 'btn_mainmenu', this.mainmenuClick, this, 1, 0, 2);
            this.btnMainmenu.anchor.setTo(0.5, 0.5);
            this.btnMainmenu.alpha = 0;

            this.btnRestart = this.add.button(this.world.centerX, this.world.centerY, 'btn_restart', this.restartClick, this, 1, 0, 2);
            this.btnRestart.anchor.setTo(0.5, 0.5);
            this.btnRestart.alpha = 0;

            //Win and lose limits
            this.playerWinCondition = 3;
            this.enemyWinCondition = 3;

            //Booleans
            this.doUpdate = false;
            this.won = false;
            this.lost = false;

            //Controls the sound of the countdown, probably a cheap way to do it
            this.play3 = true;
            this.play2 = true;
            this.play1 = true;

            //Checks if the game is muted
            this.mute = false;
        };

        LevelEasy.prototype.update = function () {
            if (this.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.music.stop();
                this.elevator.stop();
                this.game.state.start('MainMenu', true, false);
            }

            //Do the countdown
            if (this.doCountdown) {
                this.countdown();
            }

            //Update the game
            if (this.doUpdate && !this.won && !this.lost) {
                this.ball.updateBall();

                this.player.updatePlayer();
                this.enemy.updateEnemy();

                //Vertical collision
                this.physics.collide(this.ball, this.lateralTop, this.ballCollisionVertical, null, this);
                this.physics.collide(this.ball, this.lateralBot, this.ballCollisionVertical, null, this);

                //Horizontal collision
                this.physics.collide(this.ball, this.lateralRight, this.ballCollisionPlayerPoint, null, this);
                this.physics.collide(this.ball, this.lateralLeft, this.ballCollisionEnemyPoint, null, this);

                //Pad collision
                this.physics.collide(this.ball, this.player, this.ballCollisionPlayer, null, this);
                this.physics.collide(this.ball, this.enemy, this.ballCollisionEnemy, null, this);

                //AI
                if (this.ball.y < this.enemy.y) {
                    this.enemy.moveUp(this.ball.y);
                } else if (this.ball.y > this.enemy.y) {
                    this.enemy.moveDown(this.ball.y);
                }
            }
        };

        LevelEasy.prototype.countdown = function () {
            this.countdownTimer += this.game.time.elapsed;
            if (this.countdownTimer > 250 && this.countdownTimer <= 750) {
                this.countdownText.content = "3";
                if (this.play3) {
                    this.beep23.play();
                    this.play3 = false;
                }
            } else if (this.countdownTimer > 750 && this.countdownTimer <= 1250) {
                this.countdownText.content = "";
            } else if (this.countdownTimer > 1250 && this.countdownTimer <= 1750) {
                this.countdownText.content = "2";
                if (this.play2) {
                    this.beep23.play();
                    this.play2 = false;
                }
            } else if (this.countdownTimer > 1750 && this.countdownTimer <= 2250) {
                this.countdownText.content = "";
            } else if (this.countdownTimer > 2250 && this.countdownTimer <= 2750) {
                this.countdownText.content = "1";
                if (this.play1) {
                    this.beep1.play();
                    this.play1 = false;
                }
            } else if (this.countdownTimer > 2750) {
                this.countdownText.content = "";
                this.countdownTimer = 0;
                this.doCountdown = false;
                this.doUpdate = true;

                this.play1 = true;
                this.play2 = true;
                this.play3 = true;

                if (!this.music.isPlaying) {
                    this.music.resume();
                }
            }
        };

        LevelEasy.prototype.ballCollisionVertical = function () {
            this.ball.dir = -this.ball.dir;
            this.hitWall.play();
        };

        LevelEasy.prototype.ballCollisionPlayer = function () {
            //Change angle of the ball, it's influenced by the hit location of the pad
            var distance = this.player.y - this.ball.y;
            this.ball.dir = Math.PI - this.ball.dir - ((distance * 0.3) * (Math.PI) / 180);

            //Accelerate the ball and the pad
            this.ball.vel += 0.1;
            if (this.ball.vel >= this.BALL_SPEED * 2) {
                this.ball.vel = this.BALL_SPEED * 2;
            }
            this.player.speed += 0.1;
            if (this.player.speed >= this.PLAYER_SPEED * 2) {
                this.player.speed = this.PLAYER_SPEED * 2;
            }

            this.hitPad.play();
        };

        LevelEasy.prototype.ballCollisionEnemy = function () {
            //Change angle of the ball, it's influenced by the hit location of the pad
            var distance = this.enemy.y - this.ball.y;
            this.ball.dir = Math.PI - this.ball.dir + ((distance * 0.3) * (Math.PI) / 180);

            //Accelerate the ball and the pad
            this.ball.vel += 0.1;
            if (this.ball.vel >= this.BALL_SPEED * 2) {
                this.ball.vel = this.BALL_SPEED * 2;
            }
            this.enemy.speed += 0.1;
            if (this.enemy.speed >= this.ENEMY_SPEED * 2) {
                this.enemy.speed = this.ENEMY_SPEED * 2;
            }

            this.hitPad.play();
        };

        LevelEasy.prototype.ballCollisionPlayerPoint = function () {
            //Set the score
            this.playerScoreN += 1;
            this.playerScore.content = this.playerScoreN + "";
            this.playerScore.anchor.setTo(0.5, 0.5);

            //Reset board
            this.boardReset(0);

            //Win condition
            if (this.playerScoreN == this.playerWinCondition) {
                this.won = true;
                this.animateWinnerAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.winSound.play();
            }

            //Lose condition
            if (this.enemyScoreN == this.enemyWinCondition) {
                this.lost = true;
                this.animateLoserAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.loseSound.play();
            }

            if (this.playerScoreN != this.playerWinCondition && this.enemyScoreN != this.enemyWinCondition) {
                this.playerPoint.play();
            }
        };

        LevelEasy.prototype.ballCollisionEnemyPoint = function () {
            //Set the score
            this.enemyScoreN += 1;
            this.enemyScore.content = this.enemyScoreN + "";
            this.enemyScore.anchor.setTo(0.5, 0.5);

            //Reset board
            this.boardReset(Math.PI);

            //Win condition
            if (this.playerScoreN == this.playerWinCondition) {
                this.won = true;
                this.animateWinnerAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.winSound.play();
            }

            //Lose condition
            if (this.enemyScoreN == this.enemyWinCondition) {
                this.lost = true;
                this.animateLoserAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.loseSound.play();
            }

            if (this.playerScoreN != this.playerWinCondition && this.enemyScoreN != this.enemyWinCondition) {
                this.enemyPoint.play();
            }
        };

        LevelEasy.prototype.mainmenuClick = function () {
            this.game.state.start('MainMenu', true, false);
        };

        LevelEasy.prototype.restartClick = function () {
            this.playerScoreN = 0;
            this.playerScore.content = this.playerScoreN + "";
            this.playerScore.anchor.setTo(0.5, 0.5);
            this.enemyScoreN = 0;
            this.enemyScore.content = this.enemyScoreN + "";
            this.enemyScore.anchor.setTo(0.5, 0.5);

            if (this.won) {
                this.add.tween(this.letterW).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 0, false);
                this.add.tween(this.letterI).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 250, false);
                this.add.tween(this.letterN).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 500, false);
                this.add.tween(this.letterN2).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 750, false);
                this.add.tween(this.letterE).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1000, false);
                this.add.tween(this.letterR).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1250, false);

                this.add.tween(this.btnRestart).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.btnMainmenu).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 750);
            }

            if (this.lost) {
                this.add.tween(this.gameOver).to({ alpha: 0 }, 1000, Phaser.Easing.Circular.In, true, 0, false);

                this.add.tween(this.btnRestart).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.btnMainmenu).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 750);
            }

            this.won = false;
            this.lost = false;
            this.doCountdown = true;

            this.music.stop();
            this.elevator.stop();
            this.music.play('', 0, 0.5, true);
            this.elevator.play('', 0, 0.5, true);
            this.music.pause();
            this.elevator.pause();
        };

        LevelEasy.prototype.boardReset = function (dir) {
            this.player.resetPlayer();
            this.enemy.resetEnemy();
            this.ball.resetBall(dir);
            this.doCountdown = !(this.playerScoreN >= this.playerWinCondition || this.enemyScoreN >= this.enemyWinCondition);
            this.doUpdate = false;
        };

        LevelEasy.prototype.animateWinnerAndButtons = function () {
            this.add.tween(this.letterW).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 500, false);
            this.add.tween(this.letterW).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 500, false);

            this.add.tween(this.letterI).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 1000, false);
            this.add.tween(this.letterI).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 1000, false);

            this.add.tween(this.letterN).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 1500, false);
            this.add.tween(this.letterN).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 1500, false);

            this.add.tween(this.letterN2).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 2000, false);
            this.add.tween(this.letterN2).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 2000, false);

            this.add.tween(this.letterE).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 2500, false);
            this.add.tween(this.letterE).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 2500, false);

            this.add.tween(this.letterR).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 3000, false);
            this.add.tween(this.letterR).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 3000, false);

            this.add.tween(this.btnRestart).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 3250);
            this.add.tween(this.btnMainmenu).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 3500);
        };

        LevelEasy.prototype.animateLoserAndButtons = function () {
            this.add.tween(this.gameOver).to({ alpha: 1 }, 1500, Phaser.Easing.Elastic.InOut, true, 500, false);

            this.add.tween(this.btnRestart).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1000);
            this.add.tween(this.btnMainmenu).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1250);

            this.add.tween(this.gameOver).to({ alpha: 0.2 }, 1500, Phaser.Easing.Cubic.In, true, 1500, false);
            this.add.tween(this.gameOver).to({ alpha: 1 }, 1500, Phaser.Easing.Cubic.In, true, 3000, false);
        };

        LevelEasy.prototype.pauseGame = function () {
            if (!this.won && !this.lost) {
                this.doUpdate = !this.doUpdate;
                this.pauseText.visible = !this.doUpdate;

                if (this.pauseText.visible) {
                    if (this.music.isPlaying) {
                        this.music.pause();
                    }
                    if (!this.elevator.isPlaying) {
                        this.elevator.resume();
                    }
                } else {
                    if (!this.music.isPlaying) {
                        this.music.resume();
                    }
                    if (this.elevator.isPlaying) {
                        this.elevator.pause();
                    }
                }
            }
        };

        LevelEasy.prototype.clickVolume = function () {
            this.mute = !this.mute;
            this.sound.mute = this.mute;
            this.iconVolumeHover.visible = this.mute;
            this.iconVolume.visible = !this.iconVolumeHover.visible;
        };
        return LevelEasy;
    })(Phaser.State);
    Game1.LevelEasy = LevelEasy;
})(Game1 || (Game1 = {}));
var Game1;
(function (Game1) {
    var LevelHard = (function (_super) {
        __extends(LevelHard, _super);
        function LevelHard() {
            _super.apply(this, arguments);
            this.PLAYER_SPEED = 1.5;
            this.ENEMY_SPEED = 2;
            this.BALL_SPEED = 7;
        }
        LevelHard.prototype.create = function () {
            //Volume icon
            this.iconVolume = this.add.sprite(20, this.world.height - 70, 'icon_volume');
            this.iconVolume.inputEnabled = true;
            this.iconVolume.events.onInputDown.add(this.clickVolume, this);
            this.iconVolumeHover = this.add.sprite(20, this.world.height - 70, 'icon_volume_hover');
            this.iconVolumeHover.inputEnabled = true;
            this.iconVolumeHover.events.onInputDown.add(this.clickVolume, this);
            this.iconVolumeHover.visible = false;

            //Field
            this.lateralLeft = this.add.sprite(0, 0, 'field_laterals');
            this.lateralRight = this.add.sprite(790, 0, 'field_laterals');
            this.lateralTop = this.add.sprite(0, 0, 'field_verticals');
            this.lateralBot = this.add.sprite(0, 590, 'field_verticals');

            this.lateralLeft.fixedToCamera = true;
            this.lateralRight.fixedToCamera = true;
            this.lateralTop.fixedToCamera = true;
            this.lateralBot.fixedToCamera = true;

            //Countdown
            this.countdownText = this.add.text(this.world.centerX, this.world.centerY, "", { font: "64px Chunk", fill: "#ffffff", align: "center" });
            this.countdownText.anchor.setTo(0.5, 0.5);
            this.countdownTimer = 0;
            this.doCountdown = true;

            //Scores
            this.playerScoreN = 0;
            this.playerScore = this.add.text(this.world.centerX - 40, 50, this.playerScoreN + "", { font: "48px Chunk", fill: "#ffffff", align: "center" });
            this.playerScore.anchor.setTo(0.5, 0.5);
            this.enemyScoreN = 0;
            this.enemyScore = this.add.text(this.world.centerX + 40, 50, this.enemyScoreN + "", { font: "48px Chunk", fill: "#ffffff", align: "center" });
            this.enemyScore.anchor.setTo(0.5, 0.5);

            //Win text
            this.letterW = this.add.sprite(233, -100, 'win_w');
            this.letterW.anchor.setTo(0.5, 0.5);
            this.letterI = this.add.sprite(303, -100, 'win_i');
            this.letterI.anchor.setTo(0.5, 0.5);
            this.letterN = this.add.sprite(363, -100, 'win_n');
            this.letterN.anchor.setTo(0.5, 0.5);
            this.letterN2 = this.add.sprite(441, -100, 'win_n');
            this.letterN2.anchor.setTo(0.5, 0.5);
            this.letterE = this.add.sprite(513, -100, 'win_e');
            this.letterE.anchor.setTo(0.5, 0.5);
            this.letterR = this.add.sprite(583, -100, 'win_r');
            this.letterR.anchor.setTo(0.5, 0.5);

            //Lose text
            this.gameOver = this.add.sprite(this.world.centerX, this.world.centerY - 150, 'game_over');
            this.gameOver.anchor.setTo(0.5, 0.5);
            this.gameOver.alpha = 0;

            //Sound
            this.beep1 = this.add.audio('beep1', 1, false);
            this.beep23 = this.add.audio('beep32', 1, false);
            this.hitWall = this.add.audio('hit_wall', 1, false);
            this.hitPad = this.add.audio('hit_pad', 1, false);
            this.playerPoint = this.add.audio('player_point', 1, false);
            this.enemyPoint = this.add.audio('enemy_point', 1, false);
            this.winSound = this.add.audio('win', 1, false);
            this.loseSound = this.add.audio('lose', 1, false);
            this.elevator = this.add.audio('elevator', 0.5, true);
            this.music = this.add.audio('the_big_game', 0.5, true);
            this.elevator.play('', 0, 0.5, true);
            this.elevator.pause();
            this.music.play('', 0, 0.5, true);
            this.music.pause();

            //Player, enemy and the ball
            this.player = new Game1.Player(this.game, this.lateralTop, this.lateralBot, 50, this.world.centerY, this.PLAYER_SPEED);
            this.enemy = new Game1.Enemy(this.game, this.lateralTop, this.lateralBot, 750, this.world.centerY, this.ENEMY_SPEED);
            this.ball = new Game1.Ball(this.game, this.game.world.centerX, this.game.world.centerY, this.BALL_SPEED, Math.PI);

            //Pause key
            this.pauseButton = this.input.keyboard.addKey(Phaser.Keyboard.P);
            this.pauseButton.onDown.add(this.pauseGame, this);
            this.pauseText = this.add.text(this.world.centerX, this.world.centerY, "PAUSED", { font: "64px Chunk", fill: "#ffffff", align: "center" });
            this.pauseText.anchor.setTo(0.5, 0.5);
            this.pauseText.visible = false;

            //Endgame buttons
            this.btnMainmenu = this.add.button(this.world.centerX, this.world.centerY + 90, 'btn_mainmenu', this.mainmenuClick, this, 1, 0, 2);
            this.btnMainmenu.anchor.setTo(0.5, 0.5);
            this.btnMainmenu.alpha = 0;

            this.btnRestart = this.add.button(this.world.centerX, this.world.centerY, 'btn_restart', this.restartClick, this, 1, 0, 2);
            this.btnRestart.anchor.setTo(0.5, 0.5);
            this.btnRestart.alpha = 0;

            //Win and lose limits
            this.playerWinCondition = 3;
            this.enemyWinCondition = 3;

            //Booleans
            this.doUpdate = false;
            this.won = false;
            this.lost = false;

            //Controls the sound of the countdown, probably a cheap way to do it
            this.play3 = true;
            this.play2 = true;
            this.play1 = true;

            //Checks if the game is muted
            this.mute = false;
        };

        LevelHard.prototype.update = function () {
            if (this.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.music.stop();
                this.elevator.stop();
                this.game.state.start('MainMenu', true, false);
            }

            //Do the countdown
            if (this.doCountdown) {
                this.countdown();
            }

            //Update the game
            if (this.doUpdate && !this.won && !this.lost) {
                this.ball.updateBall();

                this.player.updatePlayer();
                this.enemy.updateEnemy();

                //Vertical collision
                this.physics.collide(this.ball, this.lateralTop, this.ballCollisionVertical, null, this);
                this.physics.collide(this.ball, this.lateralBot, this.ballCollisionVertical, null, this);

                //Horizontal collision
                this.physics.collide(this.ball, this.lateralRight, this.ballCollisionPlayerPoint, null, this);
                this.physics.collide(this.ball, this.lateralLeft, this.ballCollisionEnemyPoint, null, this);

                //Pad collision
                this.physics.collide(this.ball, this.player, this.ballCollisionPlayer, null, this);
                this.physics.collide(this.ball, this.enemy, this.ballCollisionEnemy, null, this);

                //AI
                if (this.ball.y < this.enemy.y) {
                    this.enemy.moveUp(this.ball.y);
                } else if (this.ball.y > this.enemy.y) {
                    this.enemy.moveDown(this.ball.y);
                }
            }
        };

        LevelHard.prototype.countdown = function () {
            this.countdownTimer += this.game.time.elapsed;
            if (this.countdownTimer > 250 && this.countdownTimer <= 750) {
                this.countdownText.content = "3";
                if (this.play3) {
                    this.beep23.play();
                    this.play3 = false;
                }
            } else if (this.countdownTimer > 750 && this.countdownTimer <= 1250) {
                this.countdownText.content = "";
            } else if (this.countdownTimer > 1250 && this.countdownTimer <= 1750) {
                this.countdownText.content = "2";
                if (this.play2) {
                    this.beep23.play();
                    this.play2 = false;
                }
            } else if (this.countdownTimer > 1750 && this.countdownTimer <= 2250) {
                this.countdownText.content = "";
            } else if (this.countdownTimer > 2250 && this.countdownTimer <= 2750) {
                this.countdownText.content = "1";
                if (this.play1) {
                    this.beep1.play();
                    this.play1 = false;
                }
            } else if (this.countdownTimer > 2750) {
                this.countdownText.content = "";
                this.countdownTimer = 0;
                this.doCountdown = false;
                this.doUpdate = true;

                this.play1 = true;
                this.play2 = true;
                this.play3 = true;

                if (!this.music.isPlaying) {
                    this.music.resume();
                }
            }
        };

        LevelHard.prototype.ballCollisionVertical = function () {
            this.ball.dir = -this.ball.dir;
            this.hitWall.play();
        };

        LevelHard.prototype.ballCollisionPlayer = function () {
            //Change angle of the ball, it's influenced by the hit location of the pad
            var distance = this.player.y - this.ball.y;
            this.ball.dir = Math.PI - this.ball.dir - ((distance * 0.3) * (Math.PI) / 180);

            //Accelerate the ball and the pad
            this.ball.vel += 0.1;
            if (this.ball.vel >= this.BALL_SPEED * 2) {
                this.ball.vel = this.BALL_SPEED * 2;
            }
            this.player.speed += 0.1;
            if (this.player.speed >= this.PLAYER_SPEED * 2) {
                this.player.speed = this.PLAYER_SPEED * 2;
            }

            this.hitPad.play();
        };

        LevelHard.prototype.ballCollisionEnemy = function () {
            //Change angle of the ball, it's influenced by the hit location of the pad
            var distance = this.enemy.y - this.ball.y;
            this.ball.dir = Math.PI - this.ball.dir + ((distance * 0.3) * (Math.PI) / 180);

            //Accelerate the ball and the pad
            this.ball.vel += 0.1;
            if (this.ball.vel >= this.BALL_SPEED * 2) {
                this.ball.vel = this.BALL_SPEED * 2;
            }
            this.enemy.speed += 0.1;
            if (this.enemy.speed >= this.ENEMY_SPEED * 2) {
                this.enemy.speed = this.ENEMY_SPEED * 2;
            }

            this.hitPad.play();
        };

        LevelHard.prototype.ballCollisionPlayerPoint = function () {
            //Set the score
            this.playerScoreN += 1;
            this.playerScore.content = this.playerScoreN + "";
            this.playerScore.anchor.setTo(0.5, 0.5);

            //Reset board
            this.boardReset(0);

            //Win condition
            if (this.playerScoreN == this.playerWinCondition) {
                this.won = true;
                this.animateWinnerAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.winSound.play();
            }

            //Lose condition
            if (this.enemyScoreN == this.enemyWinCondition) {
                this.lost = true;
                this.animateLoserAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.loseSound.play();
            }

            if (this.playerScoreN != this.playerWinCondition && this.enemyScoreN != this.enemyWinCondition) {
                this.playerPoint.play();
            }
        };

        LevelHard.prototype.ballCollisionEnemyPoint = function () {
            //Set the score
            this.enemyScoreN += 1;
            this.enemyScore.content = this.enemyScoreN + "";
            this.enemyScore.anchor.setTo(0.5, 0.5);

            //Reset board
            this.boardReset(Math.PI);

            //Win condition
            if (this.playerScoreN == this.playerWinCondition) {
                this.won = true;
                this.animateWinnerAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.winSound.play();
            }

            //Lose condition
            if (this.enemyScoreN == this.enemyWinCondition) {
                this.lost = true;
                this.animateLoserAndButtons();

                this.music.stop();
                this.elevator.stop();

                this.loseSound.play();
            }

            if (this.playerScoreN != this.playerWinCondition && this.enemyScoreN != this.enemyWinCondition) {
                this.enemyPoint.play();
            }
        };

        LevelHard.prototype.mainmenuClick = function () {
            this.game.state.start('MainMenu', true, false);
        };

        LevelHard.prototype.restartClick = function () {
            this.playerScoreN = 0;
            this.playerScore.content = this.playerScoreN + "";
            this.playerScore.anchor.setTo(0.5, 0.5);
            this.enemyScoreN = 0;
            this.enemyScore.content = this.enemyScoreN + "";
            this.enemyScore.anchor.setTo(0.5, 0.5);

            if (this.won) {
                this.add.tween(this.letterW).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 0, false);
                this.add.tween(this.letterI).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 250, false);
                this.add.tween(this.letterN).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 500, false);
                this.add.tween(this.letterN2).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 750, false);
                this.add.tween(this.letterE).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1000, false);
                this.add.tween(this.letterR).to({ y: -100 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1250, false);

                this.add.tween(this.btnRestart).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.btnMainmenu).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 750);
            }

            if (this.lost) {
                this.add.tween(this.gameOver).to({ alpha: 0 }, 1000, Phaser.Easing.Circular.In, true, 0, false);

                this.add.tween(this.btnRestart).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.btnMainmenu).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 750);
            }

            this.won = false;
            this.lost = false;
            this.doCountdown = true;

            this.music.stop();
            this.elevator.stop();
            this.music.play('', 0, 0.5, true);
            this.elevator.play('', 0, 0.5, true);
            this.music.pause();
            this.elevator.pause();
        };

        LevelHard.prototype.boardReset = function (dir) {
            this.player.resetPlayer();
            this.enemy.resetEnemy();
            this.ball.resetBall(dir);
            this.doCountdown = !(this.playerScoreN >= this.playerWinCondition || this.enemyScoreN >= this.enemyWinCondition);
            this.doUpdate = false;
        };

        LevelHard.prototype.animateWinnerAndButtons = function () {
            this.add.tween(this.letterW).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 500, false);
            this.add.tween(this.letterW).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 500, false);

            this.add.tween(this.letterI).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 1000, false);
            this.add.tween(this.letterI).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 1000, false);

            this.add.tween(this.letterN).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 1500, false);
            this.add.tween(this.letterN).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 1500, false);

            this.add.tween(this.letterN2).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 2000, false);
            this.add.tween(this.letterN2).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 2000, false);

            this.add.tween(this.letterE).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 2500, false);
            this.add.tween(this.letterE).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 2500, false);

            this.add.tween(this.letterR).to({ y: 200 }, 1500, Phaser.Easing.Bounce.Out, true, 3000, false);
            this.add.tween(this.letterR).to({ angle: 360 }, 1500, Phaser.Easing.Bounce.Out, true, 3000, false);

            this.add.tween(this.btnRestart).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 3250);
            this.add.tween(this.btnMainmenu).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 3500);
        };

        LevelHard.prototype.animateLoserAndButtons = function () {
            this.add.tween(this.gameOver).to({ alpha: 1 }, 1500, Phaser.Easing.Elastic.InOut, true, 500, false);

            this.add.tween(this.btnRestart).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1000);
            this.add.tween(this.btnMainmenu).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1250);

            this.add.tween(this.gameOver).to({ alpha: 0.2 }, 1500, Phaser.Easing.Cubic.In, true, 1500, false);
            this.add.tween(this.gameOver).to({ alpha: 1 }, 1500, Phaser.Easing.Cubic.In, true, 3000, false);
        };

        LevelHard.prototype.pauseGame = function () {
            if (!this.won && !this.lost) {
                this.doUpdate = !this.doUpdate;
                this.pauseText.visible = !this.doUpdate;

                if (this.pauseText.visible) {
                    if (this.music.isPlaying) {
                        this.music.pause();
                    }
                    if (!this.elevator.isPlaying) {
                        this.elevator.resume();
                    }
                } else {
                    if (!this.music.isPlaying) {
                        this.music.resume();
                    }
                    if (this.elevator.isPlaying) {
                        this.elevator.pause();
                    }
                }
            }
        };

        LevelHard.prototype.clickVolume = function () {
            this.mute = !this.mute;
            this.sound.mute = this.mute;
            this.iconVolumeHover.visible = this.mute;
            this.iconVolume.visible = !this.iconVolumeHover.visible;
        };
        return LevelHard;
    })(Phaser.State);
    Game1.LevelHard = LevelHard;
})(Game1 || (Game1 = {}));
var Game1;
(function (Game1) {
    var PlayMenu = (function (_super) {
        __extends(PlayMenu, _super);
        function PlayMenu() {
            _super.apply(this, arguments);
        }
        PlayMenu.prototype.create = function () {
            this.btnEasy = this.add.button(this.world.centerX, 100, 'btn_easy', this.playEasyClick, this, 1, 0, 2);
            this.btnEasy.anchor.setTo(0.5, 0.5);
            this.btnEasy.alpha = 0;

            this.btnNormal = this.add.button(this.world.centerX, 190, 'btn_normal', this.playNormalClick, this, 1, 0, 2);
            this.btnNormal.anchor.setTo(0.5, 0.5);
            this.btnNormal.alpha = 0;

            this.btnHard = this.add.button(this.world.centerX, 280, 'btn_hard', this.playHardClick, this, 1, 0, 2);
            this.btnHard.anchor.setTo(0.5, 0.5);
            this.btnHard.alpha = 0;

            this.btnImpossible = this.add.button(this.world.centerX, 370, 'btn_impossible', this.playImpossibleClick, this, 1, 0, 2);
            this.btnImpossible.anchor.setTo(0.5, 0.5);
            this.btnImpossible.alpha = 0;

            this.btnBack = this.add.button(74, 558, 'btn_back', this.GoBackClick, this, 1, 0, 2);
            this.btnBack.anchor.setTo(0.5, 0.5);
            this.btnBack.alpha = 0;

            this.add.tween(this.btnEasy).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.btnNormal).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.btnHard).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 750);
            this.add.tween(this.btnImpossible).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1000);
            this.add.tween(this.btnBack).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1250);
        };

        PlayMenu.prototype.playEasyClick = function () {
            this.add.tween(this.btnEasy).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.btnNormal).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.btnHard).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 750);
            this.add.tween(this.btnImpossible).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1000);
            var tween = this.add.tween(this.btnBack).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1250);

            tween.onComplete.add(this.startEasyGame, this);
        };

        PlayMenu.prototype.playNormalClick = function () {
            this.add.tween(this.btnEasy).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.btnNormal).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.btnHard).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 750);
            this.add.tween(this.btnImpossible).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1000);
            var tween = this.add.tween(this.btnBack).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1250);

            tween.onComplete.add(this.startNormalGame, this);
        };

        PlayMenu.prototype.playHardClick = function () {
            this.add.tween(this.btnEasy).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.btnNormal).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.btnHard).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 750);
            this.add.tween(this.btnImpossible).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1000);
            var tween = this.add.tween(this.btnBack).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1250);

            tween.onComplete.add(this.startHardGame, this);
        };

        PlayMenu.prototype.playImpossibleClick = function () {
            this.add.tween(this.btnEasy).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.btnNormal).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.btnHard).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 750);
            this.add.tween(this.btnImpossible).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1000);
            var tween = this.add.tween(this.btnBack).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1250);

            tween.onComplete.add(this.startImpossibleGame, this);
        };

        PlayMenu.prototype.GoBackClick = function () {
            this.add.tween(this.btnEasy).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.btnNormal).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.btnHard).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 750);
            this.add.tween(this.btnImpossible).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1000);
            var tween = this.add.tween(this.btnBack).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1250);

            tween.onComplete.add(this.goBack, this);
        };

        PlayMenu.prototype.startEasyGame = function () {
            this.game.state.start('LevelEasy', true, false);
        };

        PlayMenu.prototype.startNormalGame = function () {
            this.game.state.start('LevelNormal', true, false);
        };

        PlayMenu.prototype.startHardGame = function () {
            this.game.state.start('LevelHard', true, false);
        };

        PlayMenu.prototype.startImpossibleGame = function () {
            this.game.state.start('LevelImpossible', true, false);
        };

        PlayMenu.prototype.goBack = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return PlayMenu;
    })(Phaser.State);
    Game1.PlayMenu = PlayMenu;
})(Game1 || (Game1 = {}));
var Game1;
(function (Game1) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            //Logo
            this.logo = this.add.sprite(this.world.centerX, -150, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);

            this.add.tween(this.logo).to({ y: 150 }, 1000, Phaser.Easing.Elastic.Out, true, 500);

            //Dem buttons
            this.btnPlay = this.add.button(this.world.centerX, this.world.centerY, 'btn_play', this.playClick, this, 1, 0, 2);
            this.btnPlay.anchor.setTo(0.5, 0.5);
            this.btnPlay.alpha = 0;

            this.add.tween(this.btnPlay).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1000);

            this.sound.stopAll();
        };

        MainMenu.prototype.playClick = function () {
            var tween = this.add.tween(this.logo).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.btnPlay).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 250);

            tween.onComplete.add(this.startPlayMenu, this);
        };

        MainMenu.prototype.startPlayMenu = function () {
            this.game.state.start('PlayMenu', true, false);
        };
        return MainMenu;
    })(Phaser.State);
    Game1.MainMenu = MainMenu;
})(Game1 || (Game1 = {}));
var Game1;
(function (Game1) {
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(game, top, bot, x, y, speed) {
            _super.call(this, game, x, y, 'pad_enemy', 0);

            this.top = top;
            this.bot = bot;
            this.speed = speed;
            this.firstSpeed = speed;

            this.anchor.setTo(0.5, 0.5);

            game.add.existing(this);
        }
        Enemy.prototype.updateEnemy = function () {
            this.body.x = 750;
        };

        Enemy.prototype.moveUp = function (y) {
            if (!this.game.physics.collide(this, this.top, null, null, this)) {
                this.body.y += -this.speed;
            }
        };

        Enemy.prototype.moveDown = function (y) {
            if (!this.game.physics.collide(this, this.bot, null, null, this)) {
                this.body.y += this.speed;
            }
        };

        Enemy.prototype.resetEnemy = function () {
            this.body.x = 750;
            this.body.y = this.game.world.centerY - this.height / 2;
            this.speed = this.firstSpeed;
        };
        return Enemy;
    })(Phaser.Sprite);
    Game1.Enemy = Enemy;
})(Game1 || (Game1 = {}));
var Game1;
(function (Game1) {
    var Ball = (function (_super) {
        __extends(Ball, _super);
        function Ball(game, x, y, vel, dir) {
            _super.call(this, game, x, y, 'ball', 0);

            this.anchor.setTo(0.5, 0.5);

            this.vel = vel;
            this.firstVel = vel;
            this.dir = dir;

            game.add.existing(this);
        }
        Ball.prototype.updateBall = function () {
            this.body.x = this.body.x + this.vel * Math.cos(this.dir);
            this.body.y = this.body.y + this.vel * Math.sin(this.dir);
        };

        Ball.prototype.resetBall = function (dir) {
            this.body.x = this.game.world.centerX - this.height / 2;
            this.body.y = this.game.world.centerY - this.width / 2;
            this.vel = this.firstVel;
            this.dir = dir;
        };
        return Ball;
    })(Phaser.Sprite);
    Game1.Ball = Ball;
})(Game1 || (Game1 = {}));
var Game1;
(function (Game1) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, top, bot, x, y, speed) {
            _super.call(this, game, x, y, 'pad', 0);

            this.top = top;
            this.bot = bot;
            this.speed = speed;
            this.firstSpeed = speed;

            this.anchor.setTo(0.5, 0.5);

            game.add.existing(this);
        }
        Player.prototype.updatePlayer = function () {
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
        };

        Player.prototype.resetPlayer = function () {
            this.body.x = 50;
            this.body.y = this.game.world.centerY - this.height / 2;
            this.speed = this.firstSpeed;
        };
        return Player;
    })(Phaser.Sprite);
    Game1.Player = Player;
})(Game1 || (Game1 = {}));
var Game1;
(function (Game1) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            //Preload bar and Loading text
            this.loadingText = this.add.text(this.world.centerX, this.world.centerY - ((this.world.height / 2) / 2), "Loading", { font: "48px Chunk", fill: "#ffffff", align: "center" });
            this.loadingText.anchor.setTo(0.5, 0.5);

            this.preloadBar = this.add.sprite((this.game.canvas.width / 2) - (600 / 2), (this.game.canvas.height / 2) - (50 / 2), 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            //Load our actual games assets
            this.load.image('logo', 'assets/pong.png');
            this.load.image('field_laterals', 'assets/field_laterals.png');
            this.load.image('field_verticals', 'assets/field_verticals.png');
            this.load.image('pad', 'assets/pad.png');
            this.load.image('pad_enemy', 'assets/pad_enemy.png');
            this.load.image('pad_enemy_impossible', 'assets/pad_enemy_impossible.png');
            this.load.image('ball', 'assets/ball.png');
            this.load.image('win_w', 'assets/win_lose/W.png');
            this.load.image('win_i', 'assets/win_lose/I.png');
            this.load.image('win_n', 'assets/win_lose/N.png');
            this.load.image('win_e', 'assets/win_lose/E.png');
            this.load.image('win_r', 'assets/win_lose/R.png');
            this.load.image('game_over', 'assets/win_lose/game_over.png');
            this.load.image('icon_volume', 'assets/icon_volume.png');
            this.load.image('icon_volume_hover', 'assets/icon_volume_hover.png');

            this.load.spritesheet('btn_play', 'assets/buttons/btn_play.png', 128, 64);
            this.load.spritesheet('btn_easy', 'assets/buttons/btn_easy.png', 128, 64);
            this.load.spritesheet('btn_normal', 'assets/buttons/btn_normal.png', 128, 64);
            this.load.spritesheet('btn_hard', 'assets/buttons/btn_hard.png', 128, 64);
            this.load.spritesheet('btn_impossible', 'assets/buttons/btn_impossible.png', 128, 64);
            this.load.spritesheet('btn_credits', 'assets/buttons/btn_credits.png', 128, 64);
            this.load.spritesheet('btn_back', 'assets/buttons/btn_back.png', 128, 64);
            this.load.spritesheet('btn_mainmenu', 'assets/buttons/btn_mainmenu.png', 128, 64);
            this.load.spritesheet('btn_restart', 'assets/buttons/btn_restart.png', 128, 64);

            this.load.audio('beep1', 'assets/sound/beep1.wav', false);
            this.load.audio('beep32', 'assets/sound/beep32.wav', false);
            this.load.audio('hit_wall', 'assets/sound/hit_wall.wav', true);
            this.load.audio('hit_pad', 'assets/sound/hit_pad.wav', true);
            this.load.audio('player_point', 'assets/sound/player_point.wav', true);
            this.load.audio('enemy_point', 'assets/sound/enemy_point.wav', true);
            this.load.audio('win', 'assets/sound/win.wav', true);
            this.load.audio('lose', 'assets/sound/lose.wav', true);
            this.load.audio('laugh', 'assets/sound/laugh.mp3', true);
            this.load.audio('elevator', 'assets/sound/elevator.mp3', true);
            this.load.audio('the_big_game', 'assets/sound/the_big_game.mp3', true);
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

            tween.onComplete.add(this.startMainMenu, this);
        };

        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    Game1.Preloader = Preloader;
})(Game1 || (Game1 = {}));
//# sourceMappingURL=game.js.map
