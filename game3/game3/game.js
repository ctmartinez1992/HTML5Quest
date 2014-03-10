window.onload = function () {
    var game = new Game3.Game();
};
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game3;
(function (Game3) {
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
    Game3.Boot = Boot;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 600, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Game3.Boot, false);
            this.state.add('Preloader', Game3.Preloader, false);
            this.state.add('Start', Game3.Start, false);
            this.state.add('Level1', Game3.Level1, false);
            this.state.add('Level2', Game3.Level2, false);
            this.state.add('Level3', Game3.Level3, false);
            this.state.add('Level4', Game3.Level4, false);
            this.state.add('Level5', Game3.Level5, false);
            this.state.add('Level6', Game3.Level6, false);
            this.state.add('Level7', Game3.Level7, false);
            this.state.add('Level8', Game3.Level8, false);
            this.state.add('Level9', Game3.Level9, false);
            this.state.add('Level10', Game3.Level10, false);
            this.state.add('LevelRandom', Game3.LevelRandom, false);
            this.state.add('Victory', Game3.Victory, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Game3.Game = Game;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var LevelRandom = (function (_super) {
        __extends(LevelRandom, _super);
        function LevelRandom() {
            _super.apply(this, arguments);
        }
        LevelRandom.prototype.create = function () {
            LevelRandom.SPAWN_ROW = this.game.rnd.integerInRange(1, 17);
            LevelRandom.SPAWN_COLUMN = this.game.rnd.integerInRange(1, 9);
            LevelRandom.MAX_LIVES = this.game.rnd.integerInRange(1, 4);
            LevelRandom.ENEMIES_SPEED = this.game.rnd.integerInRange(500, 3501);
            LevelRandom.PLAYER_BULLET_SPEED = this.game.rnd.integerInRange(50, 501);
            LevelRandom.PLAYER_BULLET_FREQUENCY = this.game.rnd.integerInRange(50, 1001);
            LevelRandom.ENEMY_BULLET_SPEED = this.game.rnd.integerInRange(50, 501);
            LevelRandom.ENEMY_BULLET_FREQUENCY = this.game.rnd.integerInRange(50, 1001);

            this.sound.stopAll();

            //Volume icon
            this.volume = new Game3.Volume(this.game, 5, this.world.height - 30);

            //Lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 200, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < LevelRandom.MAX_LIVES; i++) {
                var sprite = this.lives.create(this.game.world.width - 86 + (30 * i), 25, 'life');
                sprite.anchor.setTo(0.5, 0.5);
            }

            //Level
            this.currentLevel = this.add.text(10, 10, 'Level Random', { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Lose text
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Sound
            this.sExplosionEnemy = this.add.audio('explosion_enemy', 0.5, false);
            this.sExplosionPlayer = this.add.audio('explosion_player', 0.5, false);
            this.sHitPlayer = this.add.audio('hit_player', 0.5, false);
            this.sLaserEnemy = this.add.audio('laser_enemy', 0.5, false);
            this.sLaserPlayer = this.add.audio('laser_player', 0.5, false);

            //Player
            this.player = new Game3.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies
            this.enemies = this.add.group();
            this.createEnemies();
            this.livingEnemies = [];

            //Bullets
            this.bullets = this.add.group();
            this.bullets.setAll('outOfBoundsKill', true);

            this.bulletWait = 0;
            this.firingTimer = 0;

            //Enemy bullets
            this.enemyBullets = this.add.group();
            this.enemyBullets.setAll('outOfBoundsKill', true);

            //Explosions
            this.explosions = this.add.group();
            this.explosions.createMultiple(30, 'boom');
            this.explosions.forEach(this.setExplosions, this, true);

            //Booleans
            LevelRandom.doUpdate = true;
            LevelRandom.lost = false;

            //Special keys
            this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };

        LevelRandom.prototype.createEnemies = function () {
            for (var x = 0; x < LevelRandom.SPAWN_ROW; x++) {
                for (var y = 0; y < LevelRandom.SPAWN_COLUMN; y++) {
                    var enemy = this.enemies.create((x * 36), (y * 44) + 30, 'enemies');
                    enemy.anchor.setTo(0.5, 0.5);
                    enemy.animations.add('fly', [0, 1, 2, 3], 12, true);
                    enemy.play('fly');
                }
            }

            this.enemies.x = 50;
            this.enemies.y = 50;

            var tween = this.add.tween(this.enemies).to({ x: 200 }, LevelRandom.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        LevelRandom.prototype.moveEnemiesDown = function () {
            var tween = this.add.tween(this.enemies).to({ y: this.enemies.y + 20 }, LevelRandom.ENEMIES_SPEED / 4, Phaser.Easing.Linear.None, true, 0);
            tween.onComplete.add(this.moveEnemiesRight, this);
        };

        LevelRandom.prototype.moveEnemiesRight = function () {
            var tween = this.add.tween(this.enemies).to({ x: 200 }, LevelRandom.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        LevelRandom.prototype.setExplosions = function (explosion) {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('explode');
        };

        LevelRandom.prototype.update = function () {
            //Update the game
            if (LevelRandom.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                if (!LevelRandom.lost) {
                    //Fire
                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }

                    //Enemy Fire
                    if (this.time.now > this.firingTimer) {
                        this.enemyFire();
                    }

                    //Collisions
                    this.physics.overlap(this.bullets, this.enemies, this.playerHitsEnemy, null, this);
                    this.physics.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
                }

                if (LevelRandom.lost) {
                    this.loseText1.visible = true;
                    this.loseText3.visible = true;

                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                        this.game.state.start('Start', true, true);
                    }
                }
            }
        };

        LevelRandom.prototype.playerHitsEnemy = function (bullet, enemy) {
            //Sound
            this.sExplosionEnemy.play();

            //Explosion
            var explosion = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Remove both sprites
            bullet.kill();
            enemy.kill();

            //All i do is winning
            if (this.enemies.countLiving() == 0) {
                this.enemyBullets.callAll('kill', this);
                this.game.state.start('Victory', true, false);
            }
        };

        LevelRandom.prototype.enemyHitsPlayer = function (player, bullet) {
            //Sound
            this.sHitPlayer.play();

            //Kill the bullet sprite
            bullet.kill();

            //Remove 1 life
            var live = this.lives.getFirstAlive();
            if (live) {
                live.kill();
            }

            //Explosion
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Lose condition
            if (this.lives.countLiving() < 1) {
                //Sound
                this.sExplosionPlayer.play();

                this.player.kill();
                this.enemies.callAll('kill');
                this.enemyBullets.callAll('kill');
                LevelRandom.lost = true;
            }
        };

        LevelRandom.prototype.enemyCollidesPlayer = function (player, enemy) {
            //Kill them
            player.kill();
            enemy.kill();

            //Explosions
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);
            var explosion2 = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion2.anchor.setTo(0.5, 0.5);
            explosion2.animations.add('explode');
            explosion2.animations.play('explode', 30, false);

            //Sound
            this.sExplosionPlayer.play();
            this.sExplosionEnemy.play();

            //Lose condition
            if (this.lives.countLiving() < 1) {
                this.enemyBullets.callAll('kill');
                LevelRandom.lost = true;
            }
        };

        LevelRandom.prototype.fireBullet = function () {
            if (this.time.now > this.bulletWait) {
                //Sound
                this.sLaserPlayer.play();

                //Create sprite
                var bullet = this.bullets.create(this.player.x, this.player.y, 'bullets');
                bullet.anchor.setTo(0.5, 0.5);
                bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
                bullet.play('animation');

                if (bullet) {
                    bullet.reset(this.player.x, this.player.y - 25);
                    bullet.body.velocity.y = -LevelRandom.PLAYER_BULLET_SPEED;
                    this.bulletWait = this.time.now + LevelRandom.PLAYER_BULLET_FREQUENCY;
                }
            }
        };

        LevelRandom.prototype.enemyFire = function () {
            //Sound
            this.sLaserEnemy.play();

            //Create sprite
            var bullet = this.enemyBullets.create(0, 0, 'enemyBullets');
            bullet.anchor.setTo(0.5, 0.5);
            bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
            bullet.play('animation');

            this.livingEnemies = [];
            this.enemies.forEachAlive(this.countLivingEnemies, this);
            if (bullet && this.livingEnemies.length > 0) {
                //Random enemy
                var random = this.game.rnd.integerInRange(0, this.livingEnemies.length);
                var shooter = this.livingEnemies[random];

                //Fire
                bullet.reset(shooter.body.x, shooter.body.y);
                this.physics.moveToObject(bullet, this.player, LevelRandom.ENEMY_BULLET_SPEED);
                this.firingTimer = this.time.now + LevelRandom.ENEMY_BULLET_FREQUENCY;
            }
        };

        LevelRandom.prototype.countLivingEnemies = function (enemy) {
            this.livingEnemies.push(enemy);
        };
        return LevelRandom;
    })(Phaser.State);
    Game3.LevelRandom = LevelRandom;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Level10 = (function (_super) {
        __extends(Level10, _super);
        function Level10() {
            _super.apply(this, arguments);
        }
        Level10.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game3.Volume(this.game, 5, this.world.height - 30);

            //Lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 200, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < Level10.MAX_LIVES; i++) {
                var sprite = this.lives.create(this.game.world.width - 86 + (30 * i), 25, 'life');
                sprite.anchor.setTo(0.5, 0.5);
            }

            //Level
            this.currentLevel = this.add.text(10, 10, 'Level 10', { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Lose text
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Sound
            this.sExplosionEnemy = this.add.audio('explosion_enemy', 0.5, false);
            this.sExplosionPlayer = this.add.audio('explosion_player', 0.5, false);
            this.sHitPlayer = this.add.audio('hit_player', 0.5, false);
            this.sLaserEnemy = this.add.audio('laser_enemy', 0.5, false);
            this.sLaserPlayer = this.add.audio('laser_player', 0.5, false);

            //Player
            this.player = new Game3.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies
            this.enemies = this.add.group();
            this.createEnemies();
            this.livingEnemies = [];

            //Bullets
            this.bullets = this.add.group();
            this.bullets.setAll('outOfBoundsKill', true);

            this.bulletWait = 0;
            this.firingTimer = 0;

            //Enemy bullets
            this.enemyBullets = this.add.group();
            this.enemyBullets.setAll('outOfBoundsKill', true);

            //Explosions
            this.explosions = this.add.group();
            this.explosions.createMultiple(30, 'boom');
            this.explosions.forEach(this.setExplosions, this, true);

            //Booleans
            Level10.doUpdate = true;
            Level10.lost = false;

            //Special keys
            this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };

        Level10.prototype.createEnemies = function () {
            for (var x = 0; x < Level10.SPAWN_ROW; x++) {
                for (var y = 0; y < Level10.SPAWN_COLUMN; y++) {
                    var enemy = this.enemies.create((x * 36), (y * 44) + 30, 'enemies');
                    enemy.anchor.setTo(0.5, 0.5);
                    enemy.animations.add('fly', [0, 1, 2, 3], 12, true);
                    enemy.play('fly');
                }
            }

            this.enemies.x = 50;
            this.enemies.y = 50;

            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level10.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level10.prototype.moveEnemiesDown = function () {
            var tween = this.add.tween(this.enemies).to({ y: this.enemies.y + 20 }, Level10.ENEMIES_SPEED / 4, Phaser.Easing.Linear.None, true, 0);
            tween.onComplete.add(this.moveEnemiesRight, this);
        };

        Level10.prototype.moveEnemiesRight = function () {
            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level10.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level10.prototype.setExplosions = function (explosion) {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('explode');
        };

        Level10.prototype.update = function () {
            //Update the game
            if (Level10.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                if (!Level10.lost) {
                    //Fire
                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }

                    //Enemy Fire
                    if (this.time.now > this.firingTimer) {
                        this.enemyFire();
                    }

                    //Collisions
                    this.physics.overlap(this.bullets, this.enemies, this.playerHitsEnemy, null, this);
                    this.physics.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
                }

                if (Level10.lost) {
                    this.loseText1.visible = true;
                    this.loseText3.visible = true;

                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                        this.game.state.start('Start', true, true);
                    }
                }
            }
        };

        Level10.prototype.playerHitsEnemy = function (bullet, enemy) {
            //Sound
            this.sExplosionEnemy.play();

            //Explosion
            var explosion = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Remove both sprites
            bullet.kill();
            enemy.kill();

            //All i do is winning
            if (this.enemies.countLiving() == 0) {
                this.enemyBullets.callAll('kill', this);
                this.game.state.start('Victory', true, false);
            }
        };

        Level10.prototype.enemyHitsPlayer = function (player, bullet) {
            //Sound
            this.sHitPlayer.play();

            //Kill the bullet sprite
            bullet.kill();

            //Remove 1 life
            var live = this.lives.getFirstAlive();
            if (live) {
                live.kill();
            }

            //Explosion
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Lose condition
            if (this.lives.countLiving() < 1) {
                //Sound
                this.sExplosionPlayer.play();

                this.player.kill();
                this.enemies.callAll('kill');
                this.enemyBullets.callAll('kill');
                Level10.lost = true;
            }
        };

        Level10.prototype.enemyCollidesPlayer = function (player, enemy) {
            //Kill them
            player.kill();
            enemy.kill();

            //Explosions
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);
            var explosion2 = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion2.anchor.setTo(0.5, 0.5);
            explosion2.animations.add('explode');
            explosion2.animations.play('explode', 30, false);

            //Sound
            this.sExplosionPlayer.play();
            this.sExplosionEnemy.play();

            //Lose condition
            if (this.lives.countLiving() < 1) {
                this.enemyBullets.callAll('kill');
                Level10.lost = true;
            }
        };

        Level10.prototype.fireBullet = function () {
            if (this.time.now > this.bulletWait) {
                //Sound
                this.sLaserPlayer.play();

                //Create sprite
                var bullet = this.bullets.create(this.player.x, this.player.y, 'bullets');
                bullet.anchor.setTo(0.5, 0.5);
                bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
                bullet.play('animation');

                if (bullet) {
                    bullet.reset(this.player.x, this.player.y - 25);
                    bullet.body.velocity.y = -Level10.PLAYER_BULLET_SPEED;
                    this.bulletWait = this.time.now + Level10.PLAYER_BULLET_FREQUENCY;
                }
            }
        };

        Level10.prototype.enemyFire = function () {
            //Sound
            this.sLaserEnemy.play();

            //Create sprite
            var bullet = this.enemyBullets.create(0, 0, 'enemyBullets');
            bullet.anchor.setTo(0.5, 0.5);
            bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
            bullet.play('animation');

            this.livingEnemies = [];
            this.enemies.forEachAlive(this.countLivingEnemies, this);
            if (bullet && this.livingEnemies.length > 0) {
                //Random enemy
                var random = this.game.rnd.integerInRange(0, this.livingEnemies.length);
                var shooter = this.livingEnemies[random];

                //Fire
                bullet.reset(shooter.body.x, shooter.body.y);
                this.physics.moveToObject(bullet, this.player, Level10.ENEMY_BULLET_SPEED);
                this.firingTimer = this.time.now + Level10.ENEMY_BULLET_FREQUENCY;
            }
        };

        Level10.prototype.countLivingEnemies = function (enemy) {
            this.livingEnemies.push(enemy);
        };
        Level10.SPAWN_ROW = 1;
        Level10.SPAWN_COLUMN = 1;
        Level10.MAX_LIVES = 1;
        Level10.ENEMIES_SPEED = 1250;
        Level10.PLAYER_BULLET_SPEED = 150;
        Level10.PLAYER_BULLET_FREQUENCY = 150;
        Level10.ENEMY_BULLET_SPEED = 400;
        Level10.ENEMY_BULLET_FREQUENCY = 300;
        return Level10;
    })(Phaser.State);
    Game3.Level10 = Level10;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Level9 = (function (_super) {
        __extends(Level9, _super);
        function Level9() {
            _super.apply(this, arguments);
        }
        Level9.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game3.Volume(this.game, 5, this.world.height - 30);

            //Lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 200, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < Level9.MAX_LIVES; i++) {
                var sprite = this.lives.create(this.game.world.width - 86 + (30 * i), 25, 'life');
                sprite.anchor.setTo(0.5, 0.5);
            }

            //Level
            this.currentLevel = this.add.text(10, 10, 'Level 9', { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Lose text
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Sound
            this.sExplosionEnemy = this.add.audio('explosion_enemy', 0.5, false);
            this.sExplosionPlayer = this.add.audio('explosion_player', 0.5, false);
            this.sHitPlayer = this.add.audio('hit_player', 0.5, false);
            this.sLaserEnemy = this.add.audio('laser_enemy', 0.5, false);
            this.sLaserPlayer = this.add.audio('laser_player', 0.5, false);

            //Player
            this.player = new Game3.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies
            this.enemies = this.add.group();
            this.createEnemies();
            this.livingEnemies = [];

            //Bullets
            this.bullets = this.add.group();
            this.bullets.setAll('outOfBoundsKill', true);

            this.bulletWait = 0;
            this.firingTimer = 0;

            //Enemy bullets
            this.enemyBullets = this.add.group();
            this.enemyBullets.setAll('outOfBoundsKill', true);

            //Explosions
            this.explosions = this.add.group();
            this.explosions.createMultiple(30, 'boom');
            this.explosions.forEach(this.setExplosions, this, true);

            //Booleans
            Level9.doUpdate = true;
            Level9.lost = false;

            //Special keys
            this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };

        Level9.prototype.createEnemies = function () {
            for (var x = 0; x < Level9.SPAWN_ROW; x++) {
                for (var y = 0; y < Level9.SPAWN_COLUMN; y++) {
                    var enemy = this.enemies.create((x * (36 * 4)), (y * (44 * 4)) + 30, 'enemies');
                    enemy.anchor.setTo(0.5, 0.5);
                    enemy.animations.add('fly', [0, 1, 2, 3], 12, true);
                    enemy.play('fly');
                }
            }

            this.enemies.x = 50;
            this.enemies.y = 50;

            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level9.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level9.prototype.moveEnemiesDown = function () {
            var tween = this.add.tween(this.enemies).to({ y: this.enemies.y + 20 }, Level9.ENEMIES_SPEED / 4, Phaser.Easing.Linear.None, true, 0);
            tween.onComplete.add(this.moveEnemiesRight, this);
        };

        Level9.prototype.moveEnemiesRight = function () {
            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level9.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level9.prototype.setExplosions = function (explosion) {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('explode');
        };

        Level9.prototype.update = function () {
            //Update the game
            if (Level9.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                if (!Level9.lost) {
                    //Fire
                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }

                    //Enemy Fire
                    if (this.time.now > this.firingTimer) {
                        this.enemyFire();
                    }

                    //Collisions
                    this.physics.overlap(this.bullets, this.enemies, this.playerHitsEnemy, null, this);
                    this.physics.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
                }

                if (Level9.lost) {
                    this.loseText1.visible = true;
                    this.loseText3.visible = true;

                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                        this.game.state.start('Start', true, true);
                    }
                }
            }
        };

        Level9.prototype.playerHitsEnemy = function (bullet, enemy) {
            //Sound
            this.sExplosionEnemy.play();

            //Explosion
            var explosion = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Remove both sprites
            bullet.kill();
            enemy.kill();

            //All i do is winning
            if (this.enemies.countLiving() == 0) {
                this.enemyBullets.callAll('kill', this);
                this.game.state.start('Level10', true, false);
            }
        };

        Level9.prototype.enemyHitsPlayer = function (player, bullet) {
            //Sound
            this.sHitPlayer.play();

            //Kill the bullet sprite
            bullet.kill();

            //Remove 1 life
            var live = this.lives.getFirstAlive();
            if (live) {
                live.kill();
            }

            //Explosion
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Lose condition
            if (this.lives.countLiving() < 1) {
                //Sound
                this.sExplosionPlayer.play();

                this.player.kill();
                this.enemies.callAll('kill');
                this.enemyBullets.callAll('kill');
                Level9.lost = true;
            }
        };

        Level9.prototype.enemyCollidesPlayer = function (player, enemy) {
            //Kill them
            player.kill();
            enemy.kill();

            //Explosions
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);
            var explosion2 = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion2.anchor.setTo(0.5, 0.5);
            explosion2.animations.add('explode');
            explosion2.animations.play('explode', 30, false);

            //Sound
            this.sExplosionPlayer.play();
            this.sExplosionEnemy.play();

            //Lose condition
            if (this.lives.countLiving() < 1) {
                this.enemyBullets.callAll('kill');
                Level9.lost = true;
            }
        };

        Level9.prototype.fireBullet = function () {
            if (this.time.now > this.bulletWait) {
                //Sound
                this.sLaserPlayer.play();

                //Create sprite
                var bullet = this.bullets.create(this.player.x, this.player.y, 'bullets');
                bullet.anchor.setTo(0.5, 0.5);
                bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
                bullet.play('animation');

                if (bullet) {
                    bullet.reset(this.player.x, this.player.y - 25);
                    bullet.body.velocity.y = -Level9.PLAYER_BULLET_SPEED;
                    this.bulletWait = this.time.now + Level9.PLAYER_BULLET_FREQUENCY;
                }
            }
        };

        Level9.prototype.enemyFire = function () {
            //Sound
            this.sLaserEnemy.play();

            //Create sprite
            var bullet = this.enemyBullets.create(0, 0, 'enemyBullets');
            bullet.anchor.setTo(0.5, 0.5);
            bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
            bullet.play('animation');

            this.livingEnemies = [];
            this.enemies.forEachAlive(this.countLivingEnemies, this);
            if (bullet && this.livingEnemies.length > 0) {
                //Random enemy
                var random = this.game.rnd.integerInRange(0, this.livingEnemies.length);
                var shooter = this.livingEnemies[random];

                //Fire
                bullet.reset(shooter.body.x, shooter.body.y);
                this.physics.moveToObject(bullet, this.player, Level9.ENEMY_BULLET_SPEED);
                this.firingTimer = this.time.now + Level9.ENEMY_BULLET_FREQUENCY;
            }
        };

        Level9.prototype.countLivingEnemies = function (enemy) {
            this.livingEnemies.push(enemy);
        };
        Level9.SPAWN_ROW = 4;
        Level9.SPAWN_COLUMN = 2;
        Level9.MAX_LIVES = 2;
        Level9.ENEMIES_SPEED = 2000;
        Level9.PLAYER_BULLET_SPEED = 240;
        Level9.PLAYER_BULLET_FREQUENCY = 320;
        Level9.ENEMY_BULLET_SPEED = 60;
        Level9.ENEMY_BULLET_FREQUENCY = 200;
        return Level9;
    })(Phaser.State);
    Game3.Level9 = Level9;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Level8 = (function (_super) {
        __extends(Level8, _super);
        function Level8() {
            _super.apply(this, arguments);
        }
        Level8.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game3.Volume(this.game, 5, this.world.height - 30);

            //Lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 200, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < Level8.MAX_LIVES; i++) {
                var sprite = this.lives.create(this.game.world.width - 86 + (30 * i), 25, 'life');
                sprite.anchor.setTo(0.5, 0.5);
            }

            //Level
            this.currentLevel = this.add.text(10, 10, 'Level 8', { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Lose text
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Sound
            this.sExplosionEnemy = this.add.audio('explosion_enemy', 0.5, false);
            this.sExplosionPlayer = this.add.audio('explosion_player', 0.5, false);
            this.sHitPlayer = this.add.audio('hit_player', 0.5, false);
            this.sLaserEnemy = this.add.audio('laser_enemy', 0.5, false);
            this.sLaserPlayer = this.add.audio('laser_player', 0.5, false);

            //Player
            this.player = new Game3.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies
            this.enemies = this.add.group();
            this.createEnemies();
            this.livingEnemies = [];

            //Bullets
            this.bullets = this.add.group();
            this.bullets.setAll('outOfBoundsKill', true);

            this.bulletWait = 0;
            this.firingTimer = 0;

            //Enemy bullets
            this.enemyBullets = this.add.group();
            this.enemyBullets.setAll('outOfBoundsKill', true);

            //Explosions
            this.explosions = this.add.group();
            this.explosions.createMultiple(30, 'boom');
            this.explosions.forEach(this.setExplosions, this, true);

            //Booleans
            Level8.doUpdate = true;
            Level8.lost = false;

            //Special keys
            this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };

        Level8.prototype.createEnemies = function () {
            for (var x = 0; x < Level8.SPAWN_ROW; x++) {
                for (var y = 0; y < Level8.SPAWN_COLUMN; y++) {
                    var enemy = this.enemies.create((x * 36), (y * 44) + 30, 'enemies');
                    enemy.anchor.setTo(0.5, 0.5);
                    enemy.animations.add('fly', [0, 1, 2, 3], 12, true);
                    enemy.play('fly');
                }
            }

            this.enemies.x = 50;
            this.enemies.y = 50;

            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level8.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level8.prototype.moveEnemiesDown = function () {
            var tween = this.add.tween(this.enemies).to({ y: this.enemies.y + 20 }, Level8.ENEMIES_SPEED / 4, Phaser.Easing.Linear.None, true, 0);
            tween.onComplete.add(this.moveEnemiesRight, this);
        };

        Level8.prototype.moveEnemiesRight = function () {
            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level8.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level8.prototype.setExplosions = function (explosion) {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('explode');
        };

        Level8.prototype.update = function () {
            //Update the game
            if (Level8.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                if (!Level8.lost) {
                    //Fire
                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }

                    //Enemy Fire
                    if (this.time.now > this.firingTimer) {
                        this.enemyFire();
                    }

                    //Collisions
                    this.physics.overlap(this.bullets, this.enemies, this.playerHitsEnemy, null, this);
                    this.physics.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
                }

                if (Level8.lost) {
                    this.loseText1.visible = true;
                    this.loseText3.visible = true;

                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                        this.game.state.start('Start', true, true);
                    }
                }
            }
        };

        Level8.prototype.playerHitsEnemy = function (bullet, enemy) {
            //Sound
            this.sExplosionEnemy.play();

            //Explosion
            var explosion = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Remove both sprites
            bullet.kill();
            enemy.kill();

            //All i do is winning
            if (this.enemies.countLiving() == 0) {
                this.enemyBullets.callAll('kill', this);
                this.game.state.start('Level9', true, false);
            }
        };

        Level8.prototype.enemyHitsPlayer = function (player, bullet) {
            //Sound
            this.sHitPlayer.play();

            //Kill the bullet sprite
            bullet.kill();

            //Remove 1 life
            var live = this.lives.getFirstAlive();
            if (live) {
                live.kill();
            }

            //Explosion
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Lose condition
            if (this.lives.countLiving() < 1) {
                //Sound
                this.sExplosionPlayer.play();

                this.player.kill();
                this.enemies.callAll('kill');
                this.enemyBullets.callAll('kill');
                Level8.lost = true;
            }
        };

        Level8.prototype.enemyCollidesPlayer = function (player, enemy) {
            //Kill them
            player.kill();
            enemy.kill();

            //Explosions
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);
            var explosion2 = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion2.anchor.setTo(0.5, 0.5);
            explosion2.animations.add('explode');
            explosion2.animations.play('explode', 30, false);

            //Sound
            this.sExplosionPlayer.play();
            this.sExplosionEnemy.play();

            //Lose condition
            if (this.lives.countLiving() < 1) {
                this.enemyBullets.callAll('kill');
                Level8.lost = true;
            }
        };

        Level8.prototype.fireBullet = function () {
            if (this.time.now > this.bulletWait) {
                //Sound
                this.sLaserPlayer.play();

                //Create sprite
                var bullet = this.bullets.create(this.player.x, this.player.y, 'bullets');
                bullet.anchor.setTo(0.5, 0.5);
                bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
                bullet.play('animation');

                if (bullet) {
                    bullet.reset(this.player.x, this.player.y - 25);
                    bullet.body.velocity.y = -Level8.PLAYER_BULLET_SPEED;
                    this.bulletWait = this.time.now + Level8.PLAYER_BULLET_FREQUENCY;
                }
            }
        };

        Level8.prototype.enemyFire = function () {
            //Sound
            this.sLaserEnemy.play();

            //Create sprite
            var bullet = this.enemyBullets.create(0, 0, 'enemyBullets');
            bullet.anchor.setTo(0.5, 0.5);
            bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
            bullet.play('animation');

            this.livingEnemies = [];
            this.enemies.forEachAlive(this.countLivingEnemies, this);
            if (bullet && this.livingEnemies.length > 0) {
                //Random enemy
                var random = this.game.rnd.integerInRange(0, this.livingEnemies.length);
                var shooter = this.livingEnemies[random];

                //Fire
                bullet.reset(shooter.body.x, shooter.body.y);
                this.physics.moveToObject(bullet, this.player, Level8.ENEMY_BULLET_SPEED);
                this.firingTimer = this.time.now + Level8.ENEMY_BULLET_FREQUENCY;
            }
        };

        Level8.prototype.countLivingEnemies = function (enemy) {
            this.livingEnemies.push(enemy);
        };
        Level8.SPAWN_ROW = 16;
        Level8.SPAWN_COLUMN = 4;
        Level8.MAX_LIVES = 3;
        Level8.ENEMIES_SPEED = 1200;
        Level8.PLAYER_BULLET_SPEED = 240;
        Level8.PLAYER_BULLET_FREQUENCY = 320;
        Level8.ENEMY_BULLET_SPEED = 240;
        Level8.ENEMY_BULLET_FREQUENCY = 400;
        return Level8;
    })(Phaser.State);
    Game3.Level8 = Level8;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Level7 = (function (_super) {
        __extends(Level7, _super);
        function Level7() {
            _super.apply(this, arguments);
        }
        Level7.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game3.Volume(this.game, 5, this.world.height - 30);

            //Lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 200, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < Level7.MAX_LIVES; i++) {
                var sprite = this.lives.create(this.game.world.width - 86 + (30 * i), 25, 'life');
                sprite.anchor.setTo(0.5, 0.5);
            }

            //Level
            this.currentLevel = this.add.text(10, 10, 'Level 7', { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Lose text
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Sound
            this.sExplosionEnemy = this.add.audio('explosion_enemy', 0.5, false);
            this.sExplosionPlayer = this.add.audio('explosion_player', 0.5, false);
            this.sHitPlayer = this.add.audio('hit_player', 0.5, false);
            this.sLaserEnemy = this.add.audio('laser_enemy', 0.5, false);
            this.sLaserPlayer = this.add.audio('laser_player', 0.5, false);

            //Player
            this.player = new Game3.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies
            this.enemies = this.add.group();
            this.createEnemies();
            this.livingEnemies = [];

            //Bullets
            this.bullets = this.add.group();
            this.bullets.setAll('outOfBoundsKill', true);

            this.bulletWait = 0;
            this.firingTimer = 0;

            //Enemy bullets
            this.enemyBullets = this.add.group();
            this.enemyBullets.setAll('outOfBoundsKill', true);

            //Explosions
            this.explosions = this.add.group();
            this.explosions.createMultiple(30, 'boom');
            this.explosions.forEach(this.setExplosions, this, true);

            //Booleans
            Level7.doUpdate = true;
            Level7.lost = false;

            //Special keys
            this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };

        Level7.prototype.createEnemies = function () {
            for (var x = 0; x < Level7.SPAWN_ROW; x++) {
                for (var y = 0; y < Level7.SPAWN_COLUMN; y++) {
                    var enemy = this.enemies.create((x * (36 * 2)), (y * (44 * 1.5)) + 30, 'enemies');
                    enemy.anchor.setTo(0.5, 0.5);
                    enemy.animations.add('fly', [0, 1, 2, 3], 12, true);
                    enemy.play('fly');
                }
            }

            this.enemies.x = 50;
            this.enemies.y = 50;

            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level7.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level7.prototype.moveEnemiesDown = function () {
            var tween = this.add.tween(this.enemies).to({ y: this.enemies.y + 20 }, Level7.ENEMIES_SPEED / 4, Phaser.Easing.Linear.None, true, 0);
            tween.onComplete.add(this.moveEnemiesRight, this);
        };

        Level7.prototype.moveEnemiesRight = function () {
            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level7.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level7.prototype.setExplosions = function (explosion) {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('explode');
        };

        Level7.prototype.update = function () {
            //Update the game
            if (Level7.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                if (!Level7.lost) {
                    //Fire
                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }

                    //Enemy Fire
                    if (this.time.now > this.firingTimer) {
                        this.enemyFire();
                    }

                    //Collisions
                    this.physics.overlap(this.bullets, this.enemies, this.playerHitsEnemy, null, this);
                    this.physics.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
                }

                if (Level7.lost) {
                    this.loseText1.visible = true;
                    this.loseText3.visible = true;

                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                        this.game.state.start('Start', true, true);
                    }
                }
            }
        };

        Level7.prototype.playerHitsEnemy = function (bullet, enemy) {
            //Sound
            this.sExplosionEnemy.play();

            //Explosion
            var explosion = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Remove both sprites
            bullet.kill();
            enemy.kill();

            //All i do is winning
            if (this.enemies.countLiving() == 0) {
                this.enemyBullets.callAll('kill', this);
                this.game.state.start('Level8', true, false);
            }
        };

        Level7.prototype.enemyHitsPlayer = function (player, bullet) {
            //Sound
            this.sHitPlayer.play();

            //Kill the bullet sprite
            bullet.kill();

            //Remove 1 life
            var live = this.lives.getFirstAlive();
            if (live) {
                live.kill();
            }

            //Explosion
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Lose condition
            if (this.lives.countLiving() < 1) {
                //Sound
                this.sExplosionPlayer.play();

                this.player.kill();
                this.enemies.callAll('kill');
                this.enemyBullets.callAll('kill');
                Level7.lost = true;
            }
        };

        Level7.prototype.enemyCollidesPlayer = function (player, enemy) {
            //Kill them
            player.kill();
            enemy.kill();

            //Explosions
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);
            var explosion2 = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion2.anchor.setTo(0.5, 0.5);
            explosion2.animations.add('explode');
            explosion2.animations.play('explode', 30, false);

            //Sound
            this.sExplosionPlayer.play();
            this.sExplosionEnemy.play();

            //Lose condition
            if (this.lives.countLiving() < 1) {
                this.enemyBullets.callAll('kill');
                Level7.lost = true;
            }
        };

        Level7.prototype.fireBullet = function () {
            if (this.time.now > this.bulletWait) {
                //Sound
                this.sLaserPlayer.play();

                //Create sprite
                var bullet = this.bullets.create(this.player.x, this.player.y, 'bullets');
                bullet.anchor.setTo(0.5, 0.5);
                bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
                bullet.play('animation');

                if (bullet) {
                    bullet.reset(this.player.x, this.player.y - 25);
                    bullet.body.velocity.y = -Level7.PLAYER_BULLET_SPEED;
                    this.bulletWait = this.time.now + Level7.PLAYER_BULLET_FREQUENCY;
                }
            }
        };

        Level7.prototype.enemyFire = function () {
            //Sound
            this.sLaserEnemy.play();

            //Create sprite
            var bullet = this.enemyBullets.create(0, 0, 'enemyBullets');
            bullet.anchor.setTo(0.5, 0.5);
            bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
            bullet.play('animation');

            this.livingEnemies = [];
            this.enemies.forEachAlive(this.countLivingEnemies, this);
            if (bullet && this.livingEnemies.length > 0) {
                //Random enemy
                var random = this.game.rnd.integerInRange(0, this.livingEnemies.length);
                var shooter = this.livingEnemies[random];

                //Fire
                bullet.reset(shooter.body.x, shooter.body.y);
                this.physics.moveToObject(bullet, this.player, Level7.ENEMY_BULLET_SPEED);
                this.firingTimer = this.time.now + Level7.ENEMY_BULLET_FREQUENCY;
            }
        };

        Level7.prototype.countLivingEnemies = function (enemy) {
            this.livingEnemies.push(enemy);
        };
        Level7.SPAWN_ROW = 8;
        Level7.SPAWN_COLUMN = 3;
        Level7.MAX_LIVES = 2;
        Level7.ENEMIES_SPEED = 600;
        Level7.PLAYER_BULLET_SPEED = 280;
        Level7.PLAYER_BULLET_FREQUENCY = 320;
        Level7.ENEMY_BULLET_SPEED = 320;
        Level7.ENEMY_BULLET_FREQUENCY = 800;
        return Level7;
    })(Phaser.State);
    Game3.Level7 = Level7;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Level6 = (function (_super) {
        __extends(Level6, _super);
        function Level6() {
            _super.apply(this, arguments);
        }
        Level6.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game3.Volume(this.game, 5, this.world.height - 30);

            //Lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 200, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < Level6.MAX_LIVES; i++) {
                var sprite = this.lives.create(this.game.world.width - 86 + (30 * i), 25, 'life');
                sprite.anchor.setTo(0.5, 0.5);
            }

            //Level
            this.currentLevel = this.add.text(10, 10, 'Level 6', { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Lose text
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Sound
            this.sExplosionEnemy = this.add.audio('explosion_enemy', 0.5, false);
            this.sExplosionPlayer = this.add.audio('explosion_player', 0.5, false);
            this.sHitPlayer = this.add.audio('hit_player', 0.5, false);
            this.sLaserEnemy = this.add.audio('laser_enemy', 0.5, false);
            this.sLaserPlayer = this.add.audio('laser_player', 0.5, false);

            //Player
            this.player = new Game3.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies
            this.enemies = this.add.group();
            this.createEnemies();
            this.livingEnemies = [];

            //Bullets
            this.bullets = this.add.group();
            this.bullets.setAll('outOfBoundsKill', true);

            this.bulletWait = 0;
            this.firingTimer = 0;

            //Enemy bullets
            this.enemyBullets = this.add.group();
            this.enemyBullets.setAll('outOfBoundsKill', true);

            //Explosions
            this.explosions = this.add.group();
            this.explosions.createMultiple(30, 'boom');
            this.explosions.forEach(this.setExplosions, this, true);

            //Booleans
            Level6.doUpdate = true;
            Level6.lost = false;

            //Special keys
            this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };

        Level6.prototype.createEnemies = function () {
            for (var x = 0; x < Level6.SPAWN_ROW; x++) {
                for (var y = 0; y < Level6.SPAWN_COLUMN; y++) {
                    var enemy = this.enemies.create((x * 36), (y * 44) + 30, 'enemies');
                    enemy.anchor.setTo(0.5, 0.5);
                    enemy.animations.add('fly', [0, 1, 2, 3], 12, true);
                    enemy.play('fly');
                }
            }

            this.enemies.x = 50;
            this.enemies.y = 50;

            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level6.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level6.prototype.moveEnemiesDown = function () {
            var tween = this.add.tween(this.enemies).to({ y: this.enemies.y + 20 }, Level6.ENEMIES_SPEED / 4, Phaser.Easing.Linear.None, true, 0);
            tween.onComplete.add(this.moveEnemiesRight, this);
        };

        Level6.prototype.moveEnemiesRight = function () {
            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level6.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level6.prototype.setExplosions = function (explosion) {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('explode');
        };

        Level6.prototype.update = function () {
            //Update the game
            if (Level6.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                if (!Level6.lost) {
                    //Fire
                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }

                    //Enemy Fire
                    if (this.time.now > this.firingTimer) {
                        this.enemyFire();
                    }

                    //Collisions
                    this.physics.overlap(this.bullets, this.enemies, this.playerHitsEnemy, null, this);
                    this.physics.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
                }

                if (Level6.lost) {
                    this.loseText1.visible = true;
                    this.loseText3.visible = true;

                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                        this.game.state.start('Start', true, true);
                    }
                }
            }
        };

        Level6.prototype.playerHitsEnemy = function (bullet, enemy) {
            //Sound
            this.sExplosionEnemy.play();

            //Explosion
            var explosion = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Remove both sprites
            bullet.kill();
            enemy.kill();

            //All i do is winning
            if (this.enemies.countLiving() == 0) {
                this.enemyBullets.callAll('kill', this);
                this.game.state.start('Level7', true, false);
            }
        };

        Level6.prototype.enemyHitsPlayer = function (player, bullet) {
            //Sound
            this.sHitPlayer.play();

            //Kill the bullet sprite
            bullet.kill();

            //Remove 1 life
            var live = this.lives.getFirstAlive();
            if (live) {
                live.kill();
            }

            //Explosion
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Lose condition
            if (this.lives.countLiving() < 1) {
                //Sound
                this.sExplosionPlayer.play();

                this.player.kill();
                this.enemies.callAll('kill');
                this.enemyBullets.callAll('kill');
                Level6.lost = true;
            }
        };

        Level6.prototype.enemyCollidesPlayer = function (player, enemy) {
            //Kill them
            player.kill();
            enemy.kill();

            //Explosions
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);
            var explosion2 = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion2.anchor.setTo(0.5, 0.5);
            explosion2.animations.add('explode');
            explosion2.animations.play('explode', 30, false);

            //Sound
            this.sExplosionPlayer.play();
            this.sExplosionEnemy.play();

            //Lose condition
            if (this.lives.countLiving() < 1) {
                this.enemyBullets.callAll('kill');
                Level6.lost = true;
            }
        };

        Level6.prototype.fireBullet = function () {
            if (this.time.now > this.bulletWait) {
                //Sound
                this.sLaserPlayer.play();

                //Create sprite
                var bullet = this.bullets.create(this.player.x, this.player.y, 'bullets');
                bullet.anchor.setTo(0.5, 0.5);
                bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
                bullet.play('animation');

                if (bullet) {
                    bullet.reset(this.player.x, this.player.y - 25);
                    bullet.body.velocity.y = -Level6.PLAYER_BULLET_SPEED;
                    this.bulletWait = this.time.now + Level6.PLAYER_BULLET_FREQUENCY;
                }
            }
        };

        Level6.prototype.enemyFire = function () {
            //Sound
            this.sLaserEnemy.play();

            //Create sprite
            var bullet = this.enemyBullets.create(0, 0, 'enemyBullets');
            bullet.anchor.setTo(0.5, 0.5);
            bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
            bullet.play('animation');

            this.livingEnemies = [];
            this.enemies.forEachAlive(this.countLivingEnemies, this);
            if (bullet && this.livingEnemies.length > 0) {
                //Random enemy
                var random = this.game.rnd.integerInRange(0, this.livingEnemies.length);
                var shooter = this.livingEnemies[random];

                //Fire
                bullet.reset(shooter.body.x, shooter.body.y);
                this.physics.moveToObject(bullet, this.player, Level6.ENEMY_BULLET_SPEED);
                this.firingTimer = this.time.now + Level6.ENEMY_BULLET_FREQUENCY;
            }
        };

        Level6.prototype.countLivingEnemies = function (enemy) {
            this.livingEnemies.push(enemy);
        };
        Level6.SPAWN_ROW = 16;
        Level6.SPAWN_COLUMN = 2;
        Level6.MAX_LIVES = 2;
        Level6.ENEMIES_SPEED = 1000;
        Level6.PLAYER_BULLET_SPEED = 280;
        Level6.PLAYER_BULLET_FREQUENCY = 320;
        Level6.ENEMY_BULLET_SPEED = 320;
        Level6.ENEMY_BULLET_FREQUENCY = 800;
        return Level6;
    })(Phaser.State);
    Game3.Level6 = Level6;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Level5 = (function (_super) {
        __extends(Level5, _super);
        function Level5() {
            _super.apply(this, arguments);
        }
        Level5.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game3.Volume(this.game, 5, this.world.height - 30);

            //Lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 200, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < Level5.MAX_LIVES; i++) {
                var sprite = this.lives.create(this.game.world.width - 86 + (30 * i), 25, 'life');
                sprite.anchor.setTo(0.5, 0.5);
            }

            //Level
            this.currentLevel = this.add.text(10, 10, 'Level 5', { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Lose text
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Sound
            this.sExplosionEnemy = this.add.audio('explosion_enemy', 0.5, false);
            this.sExplosionPlayer = this.add.audio('explosion_player', 0.5, false);
            this.sHitPlayer = this.add.audio('hit_player', 0.5, false);
            this.sLaserEnemy = this.add.audio('laser_enemy', 0.5, false);
            this.sLaserPlayer = this.add.audio('laser_player', 0.5, false);

            //Player
            this.player = new Game3.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies
            this.enemies = this.add.group();
            this.createEnemies();
            this.livingEnemies = [];

            //Bullets
            this.bullets = this.add.group();
            this.bullets.setAll('outOfBoundsKill', true);

            this.bulletWait = 0;
            this.firingTimer = 0;

            //Enemy bullets
            this.enemyBullets = this.add.group();
            this.enemyBullets.setAll('outOfBoundsKill', true);

            //Explosions
            this.explosions = this.add.group();
            this.explosions.createMultiple(30, 'boom');
            this.explosions.forEach(this.setExplosions, this, true);

            //Booleans
            Level5.doUpdate = true;
            Level5.lost = false;

            //Special keys
            this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };

        Level5.prototype.createEnemies = function () {
            for (var x = 0; x < Level5.SPAWN_ROW; x++) {
                for (var y = 0; y < Level5.SPAWN_COLUMN; y++) {
                    var enemy = this.enemies.create((x * 36), (y * 44) + 30, 'enemies');
                    enemy.anchor.setTo(0.5, 0.5);
                    enemy.animations.add('fly', [0, 1, 2, 3], 12, true);
                    enemy.play('fly');
                }
            }

            this.enemies.x = 50;
            this.enemies.y = 50;

            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level5.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level5.prototype.moveEnemiesDown = function () {
            var tween = this.add.tween(this.enemies).to({ y: this.enemies.y + 20 }, Level5.ENEMIES_SPEED / 4, Phaser.Easing.Linear.None, true, 0);
            tween.onComplete.add(this.moveEnemiesRight, this);
        };

        Level5.prototype.moveEnemiesRight = function () {
            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level5.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level5.prototype.setExplosions = function (explosion) {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('explode');
        };

        Level5.prototype.update = function () {
            //Update the game
            if (Level5.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                if (!Level5.lost) {
                    //Fire
                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }

                    //Enemy Fire
                    if (this.time.now > this.firingTimer) {
                        this.enemyFire();
                    }

                    //Collisions
                    this.physics.overlap(this.bullets, this.enemies, this.playerHitsEnemy, null, this);
                    this.physics.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
                }

                if (Level5.lost) {
                    this.loseText1.visible = true;
                    this.loseText3.visible = true;

                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                        this.game.state.start('Start', true, true);
                    }
                }
            }
        };

        Level5.prototype.playerHitsEnemy = function (bullet, enemy) {
            //Sound
            this.sExplosionEnemy.play();

            //Explosion
            var explosion = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Remove both sprites
            bullet.kill();
            enemy.kill();

            //All i do is winning
            if (this.enemies.countLiving() == 0) {
                this.enemyBullets.callAll('kill', this);
                this.game.state.start('Level6', true, false);
            }
        };

        Level5.prototype.enemyHitsPlayer = function (player, bullet) {
            //Sound
            this.sHitPlayer.play();

            //Kill the bullet sprite
            bullet.kill();

            //Remove 1 life
            var live = this.lives.getFirstAlive();
            if (live) {
                live.kill();
            }

            //Explosion
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Lose condition
            if (this.lives.countLiving() < 1) {
                //Sound
                this.sExplosionPlayer.play();

                this.player.kill();
                this.enemies.callAll('kill');
                this.enemyBullets.callAll('kill');
                Level5.lost = true;
            }
        };

        Level5.prototype.enemyCollidesPlayer = function (player, enemy) {
            //Kill them
            player.kill();
            enemy.kill();

            //Explosions
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);
            var explosion2 = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion2.anchor.setTo(0.5, 0.5);
            explosion2.animations.add('explode');
            explosion2.animations.play('explode', 30, false);

            //Sound
            this.sExplosionPlayer.play();
            this.sExplosionEnemy.play();

            //Lose condition
            if (this.lives.countLiving() < 1) {
                this.enemyBullets.callAll('kill');
                Level5.lost = true;
            }
        };

        Level5.prototype.fireBullet = function () {
            if (this.time.now > this.bulletWait) {
                //Sound
                this.sLaserPlayer.play();

                //Create sprite
                var bullet = this.bullets.create(this.player.x, this.player.y, 'bullets');
                bullet.anchor.setTo(0.5, 0.5);
                bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
                bullet.play('animation');

                if (bullet) {
                    bullet.reset(this.player.x, this.player.y - 25);
                    bullet.body.velocity.y = -Level5.PLAYER_BULLET_SPEED;
                    this.bulletWait = this.time.now + Level5.PLAYER_BULLET_FREQUENCY;
                }
            }
        };

        Level5.prototype.enemyFire = function () {
            //Sound
            this.sLaserEnemy.play();

            //Create sprite
            var bullet = this.enemyBullets.create(0, 0, 'enemyBullets');
            bullet.anchor.setTo(0.5, 0.5);
            bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
            bullet.play('animation');

            this.livingEnemies = [];
            this.enemies.forEachAlive(this.countLivingEnemies, this);
            if (bullet && this.livingEnemies.length > 0) {
                //Random enemy
                var random = this.game.rnd.integerInRange(0, this.livingEnemies.length);
                var shooter = this.livingEnemies[random];

                //Fire
                bullet.reset(shooter.body.x, shooter.body.y);
                this.physics.moveToObject(bullet, this.player, Level5.ENEMY_BULLET_SPEED);
                this.firingTimer = this.time.now + Level5.ENEMY_BULLET_FREQUENCY;
            }
        };

        Level5.prototype.countLivingEnemies = function (enemy) {
            this.livingEnemies.push(enemy);
        };
        Level5.SPAWN_ROW = 16;
        Level5.SPAWN_COLUMN = 3;
        Level5.MAX_LIVES = 2;
        Level5.ENEMIES_SPEED = 1200;
        Level5.PLAYER_BULLET_SPEED = 320;
        Level5.PLAYER_BULLET_FREQUENCY = 280;
        Level5.ENEMY_BULLET_SPEED = 280;
        Level5.ENEMY_BULLET_FREQUENCY = 1200;
        return Level5;
    })(Phaser.State);
    Game3.Level5 = Level5;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Level4 = (function (_super) {
        __extends(Level4, _super);
        function Level4() {
            _super.apply(this, arguments);
        }
        Level4.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game3.Volume(this.game, 5, this.world.height - 30);

            //Lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 200, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < Level4.MAX_LIVES; i++) {
                var sprite = this.lives.create(this.game.world.width - 86 + (30 * i), 25, 'life');
                sprite.anchor.setTo(0.5, 0.5);
            }

            //Level
            this.currentLevel = this.add.text(10, 10, 'Level 4', { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Lose text
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Sound
            this.sExplosionEnemy = this.add.audio('explosion_enemy', 0.5, false);
            this.sExplosionPlayer = this.add.audio('explosion_player', 0.5, false);
            this.sHitPlayer = this.add.audio('hit_player', 0.5, false);
            this.sLaserEnemy = this.add.audio('laser_enemy', 0.5, false);
            this.sLaserPlayer = this.add.audio('laser_player', 0.5, false);

            //Player
            this.player = new Game3.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies
            this.enemies = this.add.group();
            this.createEnemies();
            this.livingEnemies = [];

            //Bullets
            this.bullets = this.add.group();
            this.bullets.setAll('outOfBoundsKill', true);

            this.bulletWait = 0;
            this.firingTimer = 0;

            //Enemy bullets
            this.enemyBullets = this.add.group();
            this.enemyBullets.setAll('outOfBoundsKill', true);

            //Explosions
            this.explosions = this.add.group();
            this.explosions.createMultiple(30, 'boom');
            this.explosions.forEach(this.setExplosions, this, true);

            //Booleans
            Level4.doUpdate = true;
            Level4.lost = false;

            //Special keys
            this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };

        Level4.prototype.createEnemies = function () {
            for (var x = 0; x < Level4.SPAWN_ROW; x++) {
                for (var y = 0; y < Level4.SPAWN_COLUMN; y++) {
                    var enemy = this.enemies.create((x * 36) + 70, (y * 44) + 30, 'enemies');
                    enemy.anchor.setTo(0.5, 0.5);
                    enemy.animations.add('fly', [0, 1, 2, 3], 12, true);
                    enemy.play('fly');
                }
            }

            this.enemies.x = 50;
            this.enemies.y = 50;

            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level4.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level4.prototype.moveEnemiesDown = function () {
            var tween = this.add.tween(this.enemies).to({ y: this.enemies.y + 20 }, Level4.ENEMIES_SPEED / 4, Phaser.Easing.Linear.None, true, 0);
            tween.onComplete.add(this.moveEnemiesRight, this);
        };

        Level4.prototype.moveEnemiesRight = function () {
            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level4.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level4.prototype.setExplosions = function (explosion) {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('explode');
        };

        Level4.prototype.update = function () {
            //Update the game
            if (Level4.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                if (!Level4.lost) {
                    //Fire
                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }

                    //Enemy Fire
                    if (this.time.now > this.firingTimer) {
                        this.enemyFire();
                    }

                    //Collisions
                    this.physics.overlap(this.bullets, this.enemies, this.playerHitsEnemy, null, this);
                    this.physics.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
                }

                if (Level4.lost) {
                    this.loseText1.visible = true;
                    this.loseText3.visible = true;

                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                        this.game.state.start('Start', true, true);
                    }
                }
            }
        };

        Level4.prototype.playerHitsEnemy = function (bullet, enemy) {
            //Sound
            this.sExplosionEnemy.play();

            //Explosion
            var explosion = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Remove both sprites
            bullet.kill();
            enemy.kill();

            //All i do is winning
            if (this.enemies.countLiving() == 0) {
                this.enemyBullets.callAll('kill', this);
                this.game.state.start('Level5', true, false);
            }
        };

        Level4.prototype.enemyHitsPlayer = function (player, bullet) {
            //Sound
            this.sHitPlayer.play();

            //Kill the bullet sprite
            bullet.kill();

            //Remove 1 life
            var live = this.lives.getFirstAlive();
            if (live) {
                live.kill();
            }

            //Explosion
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Lose condition
            if (this.lives.countLiving() < 1) {
                //Sound
                this.sExplosionPlayer.play();

                this.player.kill();
                this.enemies.callAll('kill');
                this.enemyBullets.callAll('kill');
                Level4.lost = true;
            }
        };

        Level4.prototype.enemyCollidesPlayer = function (player, enemy) {
            //Kill them
            player.kill();
            enemy.kill();

            //Explosions
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);
            var explosion2 = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion2.anchor.setTo(0.5, 0.5);
            explosion2.animations.add('explode');
            explosion2.animations.play('explode', 30, false);

            //Sound
            this.sExplosionPlayer.play();
            this.sExplosionEnemy.play();

            //Lose condition
            if (this.lives.countLiving() < 1) {
                this.enemyBullets.callAll('kill');
                Level4.lost = true;
            }
        };

        Level4.prototype.fireBullet = function () {
            if (this.time.now > this.bulletWait) {
                //Sound
                this.sLaserPlayer.play();

                //Create sprite
                var bullet = this.bullets.create(this.player.x, this.player.y, 'bullets');
                bullet.anchor.setTo(0.5, 0.5);
                bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
                bullet.play('animation');

                if (bullet) {
                    bullet.reset(this.player.x, this.player.y - 25);
                    bullet.body.velocity.y = -Level4.PLAYER_BULLET_SPEED;
                    this.bulletWait = this.time.now + Level4.PLAYER_BULLET_FREQUENCY;
                }
            }
        };

        Level4.prototype.enemyFire = function () {
            //Sound
            this.sLaserEnemy.play();

            //Create sprite
            var bullet = this.enemyBullets.create(0, 0, 'enemyBullets');
            bullet.anchor.setTo(0.5, 0.5);
            bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
            bullet.play('animation');

            this.livingEnemies = [];
            this.enemies.forEachAlive(this.countLivingEnemies, this);
            if (bullet && this.livingEnemies.length > 0) {
                //Random enemy
                var random = this.game.rnd.integerInRange(0, this.livingEnemies.length);
                var shooter = this.livingEnemies[random];

                //Fire
                bullet.reset(shooter.body.x, shooter.body.y);
                this.physics.moveToObject(bullet, this.player, Level4.ENEMY_BULLET_SPEED);
                this.firingTimer = this.time.now + Level4.ENEMY_BULLET_FREQUENCY;
            }
        };

        Level4.prototype.countLivingEnemies = function (enemy) {
            this.livingEnemies.push(enemy);
        };
        Level4.SPAWN_ROW = 12;
        Level4.SPAWN_COLUMN = 3;
        Level4.MAX_LIVES = 3;
        Level4.ENEMIES_SPEED = 1400;
        Level4.PLAYER_BULLET_SPEED = 340;
        Level4.PLAYER_BULLET_FREQUENCY = 260;
        Level4.ENEMY_BULLET_SPEED = 260;
        Level4.ENEMY_BULLET_FREQUENCY = 1400;
        return Level4;
    })(Phaser.State);
    Game3.Level4 = Level4;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Level3 = (function (_super) {
        __extends(Level3, _super);
        function Level3() {
            _super.apply(this, arguments);
        }
        Level3.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game3.Volume(this.game, 5, this.world.height - 30);

            //Lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 200, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < Level3.MAX_LIVES; i++) {
                var sprite = this.lives.create(this.game.world.width - 86 + (30 * i), 25, 'life');
                sprite.anchor.setTo(0.5, 0.5);
            }

            //Level
            this.currentLevel = this.add.text(10, 10, 'Level 3', { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Lose text
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Sound
            this.sExplosionEnemy = this.add.audio('explosion_enemy', 0.5, false);
            this.sExplosionPlayer = this.add.audio('explosion_player', 0.5, false);
            this.sHitPlayer = this.add.audio('hit_player', 0.5, false);
            this.sLaserEnemy = this.add.audio('laser_enemy', 0.5, false);
            this.sLaserPlayer = this.add.audio('laser_player', 0.5, false);

            //Player
            this.player = new Game3.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies
            this.enemies = this.add.group();
            this.createEnemies();
            this.livingEnemies = [];

            //Bullets
            this.bullets = this.add.group();
            this.bullets.setAll('outOfBoundsKill', true);

            this.bulletWait = 0;
            this.firingTimer = 0;

            //Enemy bullets
            this.enemyBullets = this.add.group();
            this.enemyBullets.setAll('outOfBoundsKill', true);

            //Explosions
            this.explosions = this.add.group();
            this.explosions.createMultiple(30, 'boom');
            this.explosions.forEach(this.setExplosions, this, true);

            //Booleans
            Level3.doUpdate = true;
            Level3.lost = false;

            //Special keys
            this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };

        Level3.prototype.createEnemies = function () {
            for (var x = 0; x < Level3.SPAWN_ROW; x++) {
                for (var y = 0; y < Level3.SPAWN_COLUMN; y++) {
                    var enemy = this.enemies.create((x * 36), (y * 44) + 30, 'enemies');
                    enemy.anchor.setTo(0.5, 0.5);
                    enemy.animations.add('fly', [0, 1, 2, 3], 12, true);
                    enemy.play('fly');
                }
            }

            this.enemies.x = 50;
            this.enemies.y = 50;

            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level3.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level3.prototype.moveEnemiesDown = function () {
            var tween = this.add.tween(this.enemies).to({ y: this.enemies.y + 20 }, Level3.ENEMIES_SPEED / 4, Phaser.Easing.Linear.None, true, 0);
            tween.onComplete.add(this.moveEnemiesRight, this);
        };

        Level3.prototype.moveEnemiesRight = function () {
            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level3.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level3.prototype.setExplosions = function (explosion) {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('explode');
        };

        Level3.prototype.update = function () {
            //Update the game
            if (Level3.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                if (!Level3.lost) {
                    //Fire
                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }

                    //Enemy Fire
                    if (this.time.now > this.firingTimer) {
                        this.enemyFire();
                    }

                    //Collisions
                    this.physics.overlap(this.bullets, this.enemies, this.playerHitsEnemy, null, this);
                    this.physics.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
                }

                if (Level3.lost) {
                    this.loseText1.visible = true;
                    this.loseText3.visible = true;

                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                        this.game.state.start('Start', true, true);
                    }
                }
            }
        };

        Level3.prototype.playerHitsEnemy = function (bullet, enemy) {
            //Sound
            this.sExplosionEnemy.play();

            //Explosion
            var explosion = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Remove both sprites
            bullet.kill();
            enemy.kill();

            //All i do is winning
            if (this.enemies.countLiving() == 0) {
                this.enemyBullets.callAll('kill', this);
                this.game.state.start('Level4', true, false);
            }
        };

        Level3.prototype.enemyHitsPlayer = function (player, bullet) {
            //Sound
            this.sHitPlayer.play();

            //Kill the bullet sprite
            bullet.kill();

            //Remove 1 life
            var live = this.lives.getFirstAlive();
            if (live) {
                live.kill();
            }

            //Explosion
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Lose condition
            if (this.lives.countLiving() < 1) {
                //Sound
                this.sExplosionPlayer.play();

                this.player.kill();
                this.enemies.callAll('kill');
                this.enemyBullets.callAll('kill');
                Level3.lost = true;
            }
        };

        Level3.prototype.enemyCollidesPlayer = function (player, enemy) {
            //Kill them
            player.kill();
            enemy.kill();

            //Explosions
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);
            var explosion2 = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion2.anchor.setTo(0.5, 0.5);
            explosion2.animations.add('explode');
            explosion2.animations.play('explode', 30, false);

            //Sound
            this.sExplosionPlayer.play();
            this.sExplosionEnemy.play();

            //Lose condition
            if (this.lives.countLiving() < 1) {
                this.enemyBullets.callAll('kill');
                Level3.lost = true;
            }
        };

        Level3.prototype.fireBullet = function () {
            if (this.time.now > this.bulletWait) {
                //Sound
                this.sLaserPlayer.play();

                //Create sprite
                var bullet = this.bullets.create(this.player.x, this.player.y, 'bullets');
                bullet.anchor.setTo(0.5, 0.5);
                bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
                bullet.play('animation');

                if (bullet) {
                    bullet.reset(this.player.x, this.player.y - 25);
                    bullet.body.velocity.y = -Level3.PLAYER_BULLET_SPEED;
                    this.bulletWait = this.time.now + Level3.PLAYER_BULLET_FREQUENCY;
                }
            }
        };

        Level3.prototype.enemyFire = function () {
            //Sound
            this.sLaserEnemy.play();

            //Create sprite
            var bullet = this.enemyBullets.create(0, 0, 'enemyBullets');
            bullet.anchor.setTo(0.5, 0.5);
            bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
            bullet.play('animation');

            this.livingEnemies = [];
            this.enemies.forEachAlive(this.countLivingEnemies, this);
            if (bullet && this.livingEnemies.length > 0) {
                //Random enemy
                var random = this.game.rnd.integerInRange(0, this.livingEnemies.length);
                var shooter = this.livingEnemies[random];

                //Fire
                bullet.reset(shooter.body.x, shooter.body.y);
                this.physics.moveToObject(bullet, this.player, Level3.ENEMY_BULLET_SPEED);
                this.firingTimer = this.time.now + Level3.ENEMY_BULLET_FREQUENCY;
            }
        };

        Level3.prototype.countLivingEnemies = function (enemy) {
            this.livingEnemies.push(enemy);
        };
        Level3.SPAWN_ROW = 16;
        Level3.SPAWN_COLUMN = 2;
        Level3.MAX_LIVES = 3;
        Level3.ENEMIES_SPEED = 1600;
        Level3.PLAYER_BULLET_SPEED = 360;
        Level3.PLAYER_BULLET_FREQUENCY = 240;
        Level3.ENEMY_BULLET_SPEED = 240;
        Level3.ENEMY_BULLET_FREQUENCY = 1600;
        return Level3;
    })(Phaser.State);
    Game3.Level3 = Level3;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Level2 = (function (_super) {
        __extends(Level2, _super);
        function Level2() {
            _super.apply(this, arguments);
        }
        Level2.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game3.Volume(this.game, 5, this.world.height - 30);

            //Lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 200, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < Level2.MAX_LIVES; i++) {
                var sprite = this.lives.create(this.game.world.width - 86 + (30 * i), 25, 'life');
                sprite.anchor.setTo(0.5, 0.5);
            }

            //Level
            this.currentLevel = this.add.text(10, 10, 'Level 2', { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Lose text
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Sound
            this.sExplosionEnemy = this.add.audio('explosion_enemy', 0.5, false);
            this.sExplosionPlayer = this.add.audio('explosion_player', 0.5, false);
            this.sHitPlayer = this.add.audio('hit_player', 0.5, false);
            this.sLaserEnemy = this.add.audio('laser_enemy', 0.5, false);
            this.sLaserPlayer = this.add.audio('laser_player', 0.5, false);

            //Player
            this.player = new Game3.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies
            this.enemies = this.add.group();
            this.createEnemies();
            this.livingEnemies = [];

            //Bullets
            this.bullets = this.add.group();
            this.bullets.setAll('outOfBoundsKill', true);

            this.bulletWait = 0;
            this.firingTimer = 0;

            //Enemy bullets
            this.enemyBullets = this.add.group();
            this.enemyBullets.setAll('outOfBoundsKill', true);

            //Explosions
            this.explosions = this.add.group();
            this.explosions.createMultiple(30, 'boom');
            this.explosions.forEach(this.setExplosions, this, true);

            //Booleans
            Level2.doUpdate = true;
            Level2.lost = false;

            //Special keys
            this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };

        Level2.prototype.createEnemies = function () {
            for (var x = 0; x < Level2.SPAWN_ROW; x++) {
                for (var y = 0; y < Level2.SPAWN_COLUMN; y++) {
                    var enemy = this.enemies.create((x * 36) + 70, (y * 44) + 30, 'enemies');
                    enemy.anchor.setTo(0.5, 0.5);
                    enemy.animations.add('fly', [0, 1, 2, 3], 12, true);
                    enemy.play('fly');
                }
            }

            this.enemies.x = 50;
            this.enemies.y = 50;

            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level2.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level2.prototype.moveEnemiesDown = function () {
            var tween = this.add.tween(this.enemies).to({ y: this.enemies.y + 20 }, Level2.ENEMIES_SPEED / 4, Phaser.Easing.Linear.None, true, 0);
            tween.onComplete.add(this.moveEnemiesRight, this);
        };

        Level2.prototype.moveEnemiesRight = function () {
            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level2.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level2.prototype.setExplosions = function (explosion) {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('explode');
        };

        Level2.prototype.update = function () {
            //Update the game
            if (Level2.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                if (!Level2.lost) {
                    //Fire
                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }

                    //Enemy Fire
                    if (this.time.now > this.firingTimer) {
                        this.enemyFire();
                    }

                    //Collisions
                    this.physics.overlap(this.bullets, this.enemies, this.playerHitsEnemy, null, this);
                    this.physics.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
                }

                if (Level2.lost) {
                    this.loseText1.visible = true;
                    this.loseText3.visible = true;

                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                        this.game.state.start('Start', true, true);
                    }
                }
            }
        };

        Level2.prototype.playerHitsEnemy = function (bullet, enemy) {
            //Sound
            this.sExplosionEnemy.play();

            //Explosion
            var explosion = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Remove both sprites
            bullet.kill();
            enemy.kill();

            //All i do is winning
            if (this.enemies.countLiving() == 0) {
                this.enemyBullets.callAll('kill', this);
                this.game.state.start('Level3', true, false);
            }
        };

        Level2.prototype.enemyHitsPlayer = function (player, bullet) {
            //Sound
            this.sHitPlayer.play();

            //Kill the bullet sprite
            bullet.kill();

            //Remove 1 life
            var live = this.lives.getFirstAlive();
            if (live) {
                live.kill();
            }

            //Explosion
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Lose condition
            if (this.lives.countLiving() < 1) {
                //Sound
                this.sExplosionPlayer.play();

                this.player.kill();
                this.enemies.callAll('kill');
                this.enemyBullets.callAll('kill');
                Level2.lost = true;
            }
        };

        Level2.prototype.enemyCollidesPlayer = function (player, enemy) {
            //Kill them
            player.kill();
            enemy.kill();

            //Explosions
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);
            var explosion2 = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion2.anchor.setTo(0.5, 0.5);
            explosion2.animations.add('explode');
            explosion2.animations.play('explode', 30, false);

            //Sound
            this.sExplosionPlayer.play();
            this.sExplosionEnemy.play();

            //Lose condition
            if (this.lives.countLiving() < 1) {
                this.enemyBullets.callAll('kill');
                Level2.lost = true;
            }
        };

        Level2.prototype.fireBullet = function () {
            if (this.time.now > this.bulletWait) {
                //Sound
                this.sLaserPlayer.play();

                //Create sprite
                var bullet = this.bullets.create(this.player.x, this.player.y, 'bullets');
                bullet.anchor.setTo(0.5, 0.5);
                bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
                bullet.play('animation');

                if (bullet) {
                    bullet.reset(this.player.x, this.player.y - 25);
                    bullet.body.velocity.y = -Level2.PLAYER_BULLET_SPEED;
                    this.bulletWait = this.time.now + Level2.PLAYER_BULLET_FREQUENCY;
                }
            }
        };

        Level2.prototype.enemyFire = function () {
            //Sound
            this.sLaserEnemy.play();

            //Create sprite
            var bullet = this.enemyBullets.create(0, 0, 'enemyBullets');
            bullet.anchor.setTo(0.5, 0.5);
            bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
            bullet.play('animation');

            this.livingEnemies = [];
            this.enemies.forEachAlive(this.countLivingEnemies, this);
            if (bullet && this.livingEnemies.length > 0) {
                //Random enemy
                var random = this.game.rnd.integerInRange(0, this.livingEnemies.length);
                var shooter = this.livingEnemies[random];

                //Fire
                bullet.reset(shooter.body.x, shooter.body.y);
                this.physics.moveToObject(bullet, this.player, Level2.ENEMY_BULLET_SPEED);
                this.firingTimer = this.time.now + Level2.ENEMY_BULLET_FREQUENCY;
            }
        };

        Level2.prototype.countLivingEnemies = function (enemy) {
            this.livingEnemies.push(enemy);
        };
        Level2.SPAWN_ROW = 12;
        Level2.SPAWN_COLUMN = 2;
        Level2.MAX_LIVES = 3;
        Level2.ENEMIES_SPEED = 1800;
        Level2.PLAYER_BULLET_SPEED = 380;
        Level2.PLAYER_BULLET_FREQUENCY = 220;
        Level2.ENEMY_BULLET_SPEED = 220;
        Level2.ENEMY_BULLET_FREQUENCY = 1800;
        return Level2;
    })(Phaser.State);
    Game3.Level2 = Level2;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Start = (function (_super) {
        __extends(Start, _super);
        function Start() {
            _super.apply(this, arguments);
        }
        Start.prototype.create = function () {
            this.sound.stopAll();

            //Intro
            this.titleText = this.add.text(this.world.centerX, this.world.centerY - 225, "Space Invaders", { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.titleText.anchor.setTo(0.5, 0.5);
            this.introText = this.add.text(this.world.centerX, this.world.centerY - 50, "Press space to start; r for random level", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
            this.instructionsText = this.add.text(this.world.centerX, this.world.centerY + 200, "Arrows to move; Space to shoot", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.instructionsText.anchor.setTo(0.5, 0.5);
        };

        Start.prototype.update = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.game.state.start('Level1');
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                this.game.state.start('LevelRandom');
            }
        };
        return Start;
    })(Phaser.State);
    Game3.Start = Start;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
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
    Game3.Victory = Victory;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
        }
        Level1.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game3.Volume(this.game, 5, this.world.height - 30);

            //Lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 200, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < Level1.MAX_LIVES; i++) {
                var sprite = this.lives.create(this.game.world.width - 86 + (30 * i), 25, 'life');
                sprite.anchor.setTo(0.5, 0.5);
            }

            //Level
            this.currentLevel = this.add.text(10, 10, 'Level 1', { font: "20px Chunk", fill: "#ffffff", align: "center" });

            //Lose text
            this.loseText1 = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText3 = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Press r to try again', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.loseText1.anchor.setTo(0.5, 0.5);
            this.loseText3.anchor.setTo(0.5, 0.5);
            this.loseText1.visible = false;
            this.loseText3.visible = false;

            //Sound
            this.sExplosionEnemy = this.add.audio('explosion_enemy', 0.5, false);
            this.sExplosionPlayer = this.add.audio('explosion_player', 0.5, false);
            this.sHitPlayer = this.add.audio('hit_player', 0.5, false);
            this.sLaserEnemy = this.add.audio('laser_enemy', 0.5, false);
            this.sLaserPlayer = this.add.audio('laser_player', 0.5, false);

            //Player
            this.player = new Game3.Player(this.game, this.world.centerX, this.world.height - 50);

            //Enemies
            this.enemies = this.add.group();
            this.createEnemies();
            this.livingEnemies = [];

            //Bullets
            this.bullets = this.add.group();
            this.bullets.setAll('outOfBoundsKill', true);

            this.bulletWait = 0;
            this.firingTimer = 0;

            //Enemy bullets
            this.enemyBullets = this.add.group();
            this.enemyBullets.setAll('outOfBoundsKill', true);

            //Explosions
            this.explosions = this.add.group();
            this.explosions.createMultiple(30, 'boom');
            this.explosions.forEach(this.setExplosions, this, true);

            //Booleans
            Level1.doUpdate = true;
            Level1.lost = false;

            //Special keys
            this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };

        Level1.prototype.createEnemies = function () {
            for (var x = 0; x < Level1.SPAWN_ROW; x++) {
                for (var y = 0; y < Level1.SPAWN_COLUMN; y++) {
                    var enemy = this.enemies.create(x * 36, (y * 44) + 30, 'enemies');
                    enemy.anchor.setTo(0.5, 0.5);
                    enemy.animations.add('fly', [0, 1, 2, 3], 12, true);
                    enemy.play('fly');
                }
            }

            this.enemies.x = 50;
            this.enemies.y = 50;

            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level1.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level1.prototype.moveEnemiesDown = function () {
            var tween = this.add.tween(this.enemies).to({ y: this.enemies.y + 20 }, Level1.ENEMIES_SPEED / 4, Phaser.Easing.Linear.None, true, 0);
            tween.onComplete.add(this.moveEnemiesRight, this);
        };

        Level1.prototype.moveEnemiesRight = function () {
            var tween = this.add.tween(this.enemies).to({ x: 200 }, Level1.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        };

        Level1.prototype.setExplosions = function (explosion) {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('explode');
        };

        Level1.prototype.update = function () {
            //Update the game
            if (Level1.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                if (!Level1.lost) {
                    //Fire
                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }

                    //Enemy Fire
                    if (this.time.now > this.firingTimer) {
                        this.enemyFire();
                    }

                    //Collisions
                    this.physics.overlap(this.bullets, this.enemies, this.playerHitsEnemy, null, this);
                    this.physics.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
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

        Level1.prototype.playerHitsEnemy = function (bullet, enemy) {
            //Sound
            this.sExplosionEnemy.play();

            //Explosion
            var explosion = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Remove both sprites
            bullet.kill();
            enemy.kill();

            //All i do is winning
            if (this.enemies.countLiving() == 0) {
                this.enemyBullets.callAll('kill', this);
                this.game.state.start('Level2');
            }
        };

        Level1.prototype.enemyHitsPlayer = function (player, bullet) {
            //Sound
            this.sHitPlayer.play();

            //Kill the bullet sprite
            bullet.kill();

            //Remove 1 life
            var live = this.lives.getFirstAlive();
            if (live) {
                live.kill();
            }

            //Explosion
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);

            //Lose condition
            if (this.lives.countLiving() < 1) {
                //Sound
                this.sExplosionPlayer.play();

                this.player.kill();
                this.enemies.callAll('kill');
                this.enemyBullets.callAll('kill');
                Level1.lost = true;
            }
        };

        Level1.prototype.enemyCollidesPlayer = function (player, enemy) {
            //Kill them
            player.kill();
            enemy.kill();

            //Explosions
            var explosion = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);
            var explosion2 = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
            explosion2.anchor.setTo(0.5, 0.5);
            explosion2.animations.add('explode');
            explosion2.animations.play('explode', 30, false);

            //Sound
            this.sExplosionPlayer.play();
            this.sExplosionEnemy.play();

            //Lose condition
            if (this.lives.countLiving() < 1) {
                this.enemyBullets.callAll('kill');
                Level1.lost = true;
            }
        };

        Level1.prototype.fireBullet = function () {
            if (this.time.now > this.bulletWait) {
                //Sound
                this.sLaserPlayer.play();

                //Create sprite
                var bullet = this.bullets.create(this.player.x, this.player.y, 'bullets');
                bullet.anchor.setTo(0.5, 0.5);
                bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
                bullet.play('animation');

                if (bullet) {
                    bullet.reset(this.player.x, this.player.y - 25);
                    bullet.body.velocity.y = -Level1.PLAYER_BULLET_SPEED;
                    this.bulletWait = this.time.now + Level1.PLAYER_BULLET_FREQUENCY;
                }
            }
        };

        Level1.prototype.enemyFire = function () {
            //Sound
            this.sLaserEnemy.play();

            //Create sprite
            var bullet = this.enemyBullets.create(0, 0, 'enemyBullets');
            bullet.anchor.setTo(0.5, 0.5);
            bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
            bullet.play('animation');

            this.livingEnemies = [];
            this.enemies.forEachAlive(this.countLivingEnemies, this);
            if (bullet && this.livingEnemies.length > 0) {
                //Random enemy
                var random = this.game.rnd.integerInRange(0, this.livingEnemies.length);
                var shooter = this.livingEnemies[random];

                //Fire
                bullet.reset(shooter.body.x, shooter.body.y);
                this.physics.moveToObject(bullet, this.player, Level1.ENEMY_BULLET_SPEED);
                this.firingTimer = this.time.now + Level1.ENEMY_BULLET_FREQUENCY;
            }
        };

        Level1.prototype.countLivingEnemies = function (enemy) {
            this.livingEnemies.push(enemy);
        };
        Level1.SPAWN_ROW = 16;
        Level1.SPAWN_COLUMN = 1;
        Level1.MAX_LIVES = 3;
        Level1.ENEMIES_SPEED = 2000;
        Level1.PLAYER_BULLET_SPEED = 400;
        Level1.PLAYER_BULLET_FREQUENCY = 200;
        Level1.ENEMY_BULLET_SPEED = 200;
        Level1.ENEMY_BULLET_FREQUENCY = 2000;
        return Level1;
    })(Phaser.State);
    Game3.Level1 = Level1;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'player', 0);
            this.SPEED = 200;

            this.anchor.setTo(0.5, 0.5);

            game.add.existing(this);
        }
        Player.prototype.updatePlayer = function () {
            this.body.velocity.setTo(0, 0);
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x = -this.SPEED;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x = this.SPEED;
            }
        };
        return Player;
    })(Phaser.Sprite);
    Game3.Player = Player;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
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
            this.load.image('life', 'assets/life.png');

            this.load.spritesheet('bullets', 'assets/bullets.png', 7, 23);
            this.load.spritesheet('enemies', 'assets/enemies.png', 28, 30);
            this.load.spritesheet('enemyBullets', 'assets/enemyBullets.png', 15, 15);
            this.load.spritesheet('boom', 'assets/explosion.png', 64, 64, 37);

            this.load.audio('explosion_enemy', 'assets/sound/explosion_enemy.wav', true);
            this.load.audio('explosion_player', 'assets/sound/explosion_player.wav', true);
            this.load.audio('hit_player', 'assets/sound/hit_player.wav', true);
            this.load.audio('laser_enemy', 'assets/sound/laser_enemy.wav', true);
            this.load.audio('laser_player', 'assets/sound/laser_player.wav', true);
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
    Game3.Preloader = Preloader;
})(Game3 || (Game3 = {}));
var Game3;
(function (Game3) {
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
    Game3.Volume = Volume;
})(Game3 || (Game3 = {}));
//# sourceMappingURL=game.js.map
