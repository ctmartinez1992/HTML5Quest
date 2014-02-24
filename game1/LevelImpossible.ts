module Game1 {

    export class LevelImpossible extends Phaser.State {

        PLAYER_SPEED: number = 2;
        ENEMY_SPEED: number = 5;
        BALL_SPEED: number = 10;

        btnMainmenu: Phaser.Button;
        btnRestart: Phaser.Button;

        lateralLeft: Phaser.Sprite;
        lateralRight: Phaser.Sprite;
        lateralTop: Phaser.Sprite;
        lateralBot: Phaser.Sprite;

        beep1: Phaser.Sound;
        beep23: Phaser.Sound;
        hitWall: Phaser.Sound;
        hitPad: Phaser.Sound;
        playerPoint: Phaser.Sound;
        enemyPoint: Phaser.Sound;
        winSound: Phaser.Sound;
        loseSound: Phaser.Sound;
        laugh: Phaser.Sound;
        elevator: Phaser.Sound;
        music: Phaser.Sound;
        iconVolume: Phaser.Sprite;
        iconVolumeHover: Phaser.Sprite;

        countdownText: Phaser.Text;
        countdownTimer: number;
        doCountdown: boolean;

        playerScore: Phaser.Text;
        enemyScore: Phaser.Text;
        playerScoreN: number;
        enemyScoreN: number;

        letterW: Phaser.Sprite;
        letterI: Phaser.Sprite;
        letterN: Phaser.Sprite;
        letterN2: Phaser.Sprite;
        letterE: Phaser.Sprite;
        letterR: Phaser.Sprite;
        gameOver: Phaser.Sprite;

        player: Game1.Player;
        enemy: Game1.Enemy;
        ball: Game1.Ball;

        pauseButton: Phaser.Key;
        pauseText: Phaser.Text;

        playerWinCondition: number;
        enemyWinCondition: number;

        doUpdate: boolean;
        won: boolean;
        lost: boolean;

        play3: boolean;
        play2: boolean;
        play1: boolean;

        mute: boolean;

        create() {
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
            this.elevator.play('', 0, 0.5, true); this.elevator.pause();
            this.music.play('', 0, 0.5, true); this.music.pause();

            //Player, enemy and the ball
            this.player = new Player(this.game, this.lateralTop, this.lateralBot, 50, this.world.centerY, this.PLAYER_SPEED);
            this.enemy = new EnemyImpossible(this.game, this.lateralTop, this.lateralBot, 725, this.world.centerY, this.ENEMY_SPEED);
            this.ball = new Ball(this.game, this.game.world.centerX, this.game.world.centerY, this.BALL_SPEED, Math.PI);

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
        }

        update() {
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
        }

        countdown() {
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
        }

        ballCollisionVertical() {
            this.ball.dir = -this.ball.dir;
            this.hitWall.play();
        }

        ballCollisionPlayer() {
            //Change angle of the ball, it's influenced by the hit location of the pad
            var distance: number = this.player.y - this.ball.y;
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
        }

        ballCollisionEnemy() {
            //Change angle of the ball, it's influenced by the hit location of the pad
            var distance: number = this.enemy.y - this.ball.y;
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
        }

        ballCollisionPlayerPoint() {
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
        }

        ballCollisionEnemyPoint() {
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
        }

        mainmenuClick() {
            this.game.state.start('MainMenu', true, false);
        }

        restartClick() {
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
        }

        boardReset(dir: number) {
            this.player.resetPlayer();
            this.enemy.resetEnemy();
            this.ball.resetBall(dir);
            this.doCountdown = !(this.playerScoreN >= this.playerWinCondition || this.enemyScoreN >= this.enemyWinCondition);
            this.doUpdate = false;
        }

        animateWinnerAndButtons() {
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
        }

        animateLoserAndButtons() {
            this.add.tween(this.gameOver).to({ alpha: 1 }, 1500, Phaser.Easing.Elastic.InOut, true, 500, false);

            this.add.tween(this.btnRestart).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1000);
            this.add.tween(this.btnMainmenu).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1250);

            this.add.tween(this.gameOver).to({ alpha: 0.2 }, 1500, Phaser.Easing.Cubic.In, true, 1500, false);
            this.add.tween(this.gameOver).to({ alpha: 1 }, 1500, Phaser.Easing.Cubic.In, true, 3000, false);
        }

        pauseGame() {
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
        }

        clickVolume() {
            this.mute = !this.mute;
            this.sound.mute = this.mute;
            this.iconVolumeHover.visible = this.mute;
            this.iconVolume.visible = !this.iconVolumeHover.visible
        }

        playLaugh() {
            this.laugh.play();
        }
    }
}