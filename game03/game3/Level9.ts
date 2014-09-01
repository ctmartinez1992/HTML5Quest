module Game3 {

    export class Level9 extends Phaser.State {

        static SPAWN_ROW: number = 4;
        static SPAWN_COLUMN: number = 2;
        static MAX_LIVES: number = 2;
        static ENEMIES_SPEED: number = 2000;
        static PLAYER_BULLET_SPEED: number = 240;
        static PLAYER_BULLET_FREQUENCY: number = 320;
        static ENEMY_BULLET_SPEED: number = 60;
        static ENEMY_BULLET_FREQUENCY: number = 200;

        lives: Phaser.Group;

        sExplosionEnemy: Phaser.Sound;
        sExplosionPlayer: Phaser.Sound;
        sHitPlayer: Phaser.Sound;
        sLaserEnemy: Phaser.Sound;
        sLaserPlayer: Phaser.Sound;

        playerLives: Phaser.Text;
        currentLevel: Phaser.Text;
        loseText1: Phaser.Text;
        loseText3: Phaser.Text;

        player: Game3.Player;
        enemies: Phaser.Group;
        livingEnemies: Phaser.Sprite[];
        bullets: Phaser.Group;
        enemyBullets: Phaser.Group;
        explosions: Phaser.Group;
        volume: Game3.Volume;

        bulletWait: number;
        firingTimer: number;

        fireButton: Phaser.Key;

        static doUpdate: boolean;
        static lost: boolean;

        create() {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Volume(this.game, 5, this.world.height - 30);

            //Lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 200, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < Level9.MAX_LIVES; i++) {
                var sprite: Phaser.Sprite = this.lives.create(this.game.world.width - 86 + (30 * i), 25, 'life');
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
            this.player = new Player(this.game, this.world.centerX, this.world.height - 50);

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
        }

        createEnemies() {
            for (var x = 0; x < Level9.SPAWN_ROW; x++) {
                for (var y = 0; y < Level9.SPAWN_COLUMN; y++) {
                    var enemy: Phaser.Sprite = this.enemies.create((x * (36 * 4)), (y * (44 * 4)) + 30, 'enemies');
                    enemy.anchor.setTo(0.5, 0.5);
                    enemy.animations.add('fly', [0, 1, 2, 3], 12, true);
                    enemy.play('fly');
                }
            }

            this.enemies.x = 50;
            this.enemies.y = 50;

            var tween: Phaser.Tween = this.add.tween(this.enemies).to({ x: 200 }, Level9.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        }

        moveEnemiesDown() {
            var tween: Phaser.Tween = this.add.tween(this.enemies).to({ y: this.enemies.y + 20 }, Level9.ENEMIES_SPEED / 4, Phaser.Easing.Linear.None, true, 0);
            tween.onComplete.add(this.moveEnemiesRight, this);
        }

        moveEnemiesRight() {
            var tween: Phaser.Tween = this.add.tween(this.enemies).to({ x: 200 }, Level9.ENEMIES_SPEED, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.moveEnemiesDown, this);
        }

        setExplosions(explosion: any) {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add('explode');
        }

        update() {
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
        }

        playerHitsEnemy(bullet, enemy: Phaser.Sprite) {    
            //Sound
            this.sExplosionEnemy.play();

            //Explosion
            var explosion: Phaser.Sprite = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
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
        }

        enemyHitsPlayer(player, bullet) {
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
            var explosion: Phaser.Sprite = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
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
        }

        enemyCollidesPlayer(player, enemy) {
            //Kill them
            player.kill();
            enemy.kill();

            //Explosions
            var explosion: Phaser.Sprite = this.add.sprite(player.body.x + (player.body.width / 2), player.body.y + (player.body.height / 2), 'boom');
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.play('explode', 30, false);
            var explosion2: Phaser.Sprite = this.add.sprite(enemy.body.x + (enemy.body.width / 2), enemy.body.y + (enemy.body.height / 2), 'boom');
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
        }


        fireBullet() {  
            if (this.time.now > this.bulletWait) {
                //Sound
                this.sLaserPlayer.play();

                //Create sprite
                var bullet: Phaser.Sprite = this.bullets.create(this.player.x, this.player.y, 'bullets');
                bullet.anchor.setTo(0.5, 0.5);
                bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
                bullet.play('animation');

                if (bullet) {
                    bullet.reset(this.player.x, this.player.y - 25);
                    bullet.body.velocity.y = -Level9.PLAYER_BULLET_SPEED;
                    this.bulletWait = this.time.now + Level9.PLAYER_BULLET_FREQUENCY;
                }
            }
        }
        
        enemyFire() {
            //Sound
            this.sLaserEnemy.play();  

            //Create sprite
            var bullet: Phaser.Sprite = this.enemyBullets.create(0, 0, 'enemyBullets');
            bullet.anchor.setTo(0.5, 0.5);
            bullet.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 24, true);
            bullet.play('animation');

            this.livingEnemies = [];
            this.enemies.forEachAlive(this.countLivingEnemies, this);
            if (bullet && this.livingEnemies.length > 0) {
                //Random enemy
                var random: number = this.game.rnd.integerInRange(0, this.livingEnemies.length);
                var shooter: any = this.livingEnemies[random];

                //Fire
                bullet.reset(shooter.body.x, shooter.body.y);
                this.physics.moveToObject(bullet, this.player, Level9.ENEMY_BULLET_SPEED);
                this.firingTimer = this.time.now + Level9.ENEMY_BULLET_FREQUENCY;
            }
        }

        countLivingEnemies(enemy: Phaser.Sprite) {
            this.livingEnemies.push(enemy);
        }
    }
}