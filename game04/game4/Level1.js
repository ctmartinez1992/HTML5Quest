var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game4;
(function (Game4) {
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
        }
        Level1.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game4.Volume(this.game, 5, this.world.height - 30);

            //Level
            this.levelText = this.add.text(10, 10, 'Level ' + this.level, { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.levelText = this.add.text(10, 40, 'Score ' + this.score, { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Lose text
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Sound
            //Player
            this.player = new Game4.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies and bullets
            this.enemies = this.add.group();
            this.bullets = this.add.group();

            //Lose condition
            this.loseBox = this.add.sprite(0, this.world.height - 16, "lose_box");

            //Booleans
            this.move = false;
            Level1.doUpdate = true;
            Level1.lost = false;

            //Counters
            this.score = 0;
            this.level = 5;
            this.moveDownTimer = 0;
            this.fireRate = 1;
            this.bulletWait = 0;
            this.firingTimer = 0;
            this.changeRotTimer = 0;
            this.actualTime = 5200 - this.level * 200;
            this.fireTimeControl = 250 - this.fireRate * 10;

            //Keys
            this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);
            this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this.lKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.game.input.holdRate = 10;
            this.game.input.onDown.add(function () {
                this.move = true;
            }, this);
            this.game.input.onUp.add(function () {
                this.move = false;
            }, this);

            //Creation
            this.createEnemies();
            this.createBullets();
        };

        Level1.prototype.createEnemies = function () {
            for (var i = 0; i < 20; i++) {
                var t = this.add.sprite(i * 16, 16, "block");
                this.enemies.add(t);
            }
        };

        Level1.prototype.createBullets = function () {
            for (var i = 0; i < 10; i++) {
                var sprite = this.bullets.create(0, 0, "bullet");
                sprite.exists = false;
                sprite.visible = false;
                sprite.anchor.setTo(0.5, 0.5);
                sprite.events.onOutOfBounds.add(function (bullet) {
                    bullet.kill();
                });
            }
        };

        Level1.prototype.update = function () {
            //Update the game
            if (Level1.doUpdate) {
                if (!Level1.lost) {
                    //Update the player
                    this.player.updatePlayer();

                    if (this.physics.overlap(this.loseBox, this.enemies)) {
                        //this.music.stop();
                        Level1.lost = true;
                    }

                    if (this.move == true) {
                        if (this.game.input.x > this.game.world.width / 2 + 50) {
                            if (this.game.time.now > this.changeRotTimer) {
                                this.player.x += 16;
                                this.changeRotTimer = this.game.time.now + 200;
                            }
                        }

                        if (this.game.input.x < this.game.world.width / 2 - 50) {
                            if (this.game.time.now > this.changeRotTimer) {
                                this.player.x -= 16;
                                this.changeRotTimer = this.game.time.now + 200;
                            }
                        }

                        if (this.game.time.now > this.firingTimer) {
                            this.fire();
                            this.firingTimer = this.game.time.now + this.fireTimeControl;
                        }
                    }

                    if (this.game.time.now > this.moveDownTimer) {
                        this.enemies.addAll("y", 16, false, false);
                        this.createEnemies();
                        this.moveDownTimer = this.game.time.now + this.moveDownTimer;
                    }

                    if (this.rKey.isDown) {
                        if (this.game.time.now > this.changeRotTimer) {
                            this.player.x += 16;
                            this.changeRotTimer = this.game.time.now + 200;
                        }
                    }

                    if (this.lKey.isDown) {
                        if (this.game.time.now > this.changeRotTimer) {
                            this.player.x -= 16;
                            this.changeRotTimer = this.game.time.now + 200;
                        }
                    }

                    if (this.fireKey.isDown) {
                        if (this.game.time.now > this.firingTimer) {
                            this.fire();
                            this.firingTimer = this.game.time.now + this.fireTimeControl;
                        }
                    }

                    if (this.game.physics.collide(this.bullets, this.enemies, this.bulletCollidesEnemy)) {
                        this.score++;
                        this.scoreText.content = "Score " + this.score;
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

        Level1.prototype.bulletCollidesEnemy = function (e, t) {
            e.kill();
            t.destroy();
        };

        Level1.prototype.fire = function () {
            var bullet = this.bullets.getFirstExists(false);
            if (bullet) {
                bullet.reset(this.player.x, this.player.y);
                bullet.body.velocity.y = -300;
            }
        };
        return Level1;
    })(Phaser.State);
    Game4.Level1 = Level1;
})(Game4 || (Game4 = {}));
//# sourceMappingURL=Level1.js.map
