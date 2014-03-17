module Game4 {

    export class Level1 extends Phaser.State {
        
        scoreText: Phaser.Text;
        levelText: Phaser.Text;
        loseText1: Phaser.Text;
        loseText3: Phaser.Text;

        player: Game4.Player;
        enemies: Phaser.Group;
        bullets: Phaser.Group;
        bulletsBlast: Phaser.Group;
        colliders: Phaser.Group;
        volume: Game4.Volume;

        loseBox: Phaser.Sprite;

        score: number;
        level: number;
        levelCounter: number;
        moveDownTimer: number;
        actualTime: number;
        fireTimeControl: number;
        fireRate: number;
        bulletWait: number;
        firingTimer: number;
        changeRotTimer: number;

        fireKey: Phaser.Key;
        fireBlastKey: Phaser.Key;
        rKey: Phaser.Key;
        lKey: Phaser.Key;

        fireSound: Phaser.Sound;
        boxKillSound: Phaser.Sound;
        music: Phaser.Sound;

        move: boolean;
        static doUpdate: boolean;
        static lost: boolean;

        create() {
            this.sound.stopAll();
            this.time.events.stop();

            //Volume icon
            this.volume = new Volume(this.game, 0, this.world.height - 25);

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
            this.player = new Player(this.game, this.world.centerX, this.world.height - 50);

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
        }

        createEnemies() {
            for (var i = 0; i < 20; i++) {
                var sprite = this.add.sprite(i * 24, 24, "box");
                this.enemies.add(sprite)
            }
        }

        createBullets() {
            this.bullets.createMultiple(30, 'bullet');
            this.bullets.setAll('anchor.x', 0.5);
            this.bullets.setAll('anchor.y', 0.5);
            this.bullets.setAll('outOfBoundsKill', true);
        }

        update() {
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
                        if(this.levelCounter >= 10) {
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
        }

        bulletCollidesEnemy(bu, bo) {
            bu.kill();
            bo.kill();
        }

        fire() {
            this.fireSound.play();
            var bullet: Phaser.Sprite = this.bullets.create(this.player.x, this.player.y, 'bullet');
            if (bullet) {
                bullet.reset(this.player.x + 12, this.player.y - 6);
                bullet.anchor.setTo(0.5, 0.5);
                bullet.outOfBoundsKill = true;
                bullet.body.velocity.y = -300;
                this.firingTimer = this.game.time.now + this.fireTimeControl;
            }
        }

        resetBullet(b) {
            b.kill()
        }

        style;
        text1; text2; text3; text4; text5; text25;
        image1;
        text6; text7; text8;
        particles1;
        text9; text10; text11;
        text12; text13; text14; text15; text16; text17; text18; text19;
        text20; text21;
        text22; text23; text24;

        storyLine() {
            this.style = { font: "12px Chunk", fill: "#ffffff", align: "center" };

            this.text1 = this.add.text(10, this.game.height - 100, 'This is it...', this.style);
            this.text2 = this.add.text(120, this.game.height - 100, 'the', this.style);
            this.text3 = this.add.text(160, this.game.height - 100, 'extent', this.style);
            this.text4 = this.add.text(235, this.game.height - 100, 'of', this.style);
            this.text5 = this.add.text(262, this.game.height - 100, 'my', this.style);

            this.image1 = this.add.sprite(310, this.game.height - 117, 'creativity');

            this.text1.alpha = 0; this.text2.alpha = 0; this.text3.alpha = 0;
            this.text4.alpha = 0; this.text5.alpha = 0;

            this.image1.alpha = 0;

            this.add.tween(this.text1).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.text2).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1000);
            this.add.tween(this.text3).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1250);
            this.add.tween(this.text4).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1500);
            this.add.tween(this.text5).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1750);
            this.add.tween(this.image1).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 3000).onComplete.addOnce(this.storyLine2, this);
        }

        storyLine2() {
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
        }

        storyLine3() {
            this.text25.visible = false;
            this.text6 = this.add.text(10, this.game.height - 120, 'Endless', this.style);
            this.text7 = this.add.text(140, this.game.height - 120, 'Waves', this.style);
            this.text8 = this.add.text(245, this.game.height - 120, 'of', this.style);

            this.text6.alpha = 0; this.text7.alpha = 0; this.text8.alpha = 0;
            this.text6.scale.x = 0.01; this.text6.scale.y = 0.01;
            this.text7.scale.x = 0.01; this.text7.scale.y = 0.01;
            this.text8.scale.x = 0.01; this.text8.scale.y = 0.01;

            this.add.tween(this.text6).to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true);
            this.add.tween(this.text7).to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 125);
            this.add.tween(this.text8).to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.text6.scale).to({ x: 1.5, y: 1.5 }, 250, Phaser.Easing.Linear.None, true, 125);
            this.add.tween(this.text7.scale).to({ x: 1.5, y: 1.5 }, 250, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.text8.scale).to({ x: 1.5, y: 1.5 }, 250, Phaser.Easing.Linear.None, true, 375).onComplete.addOnce(this.storyLine4, this);
        }

        storyLine4() {
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
        }

        storyLine5() {
            this.add.tween(this.text9).to({ y: this.game.height + 120 }, 250, Phaser.Easing.Exponential.Out, true);
            this.add.tween(this.text10).to({ y: this.game.height + 120 }, 250, Phaser.Easing.Exponential.Out, true);
            this.add.tween(this.text11).to({ y: this.game.height + 120 }, 250, Phaser.Easing.Exponential.Out, true);
            this.add.tween(this.text6).to({ y: 1000 }, 500, Phaser.Easing.Linear.None, true, 125);
            this.add.tween(this.text7).to({ y: 1000 }, 500, Phaser.Easing.Linear.None, true, 250);
            this.add.tween(this.text8).to({ y: 1000 }, 500, Phaser.Easing.Linear.None, true, 375).onComplete.addOnce(this.storyLine6, this);
        }

        storyLine6() {
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
        }

        storyLine7() {
            this.add.tween(this.text19).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.Out, true, 2000);
            this.add.tween(this.text18).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.Out, true, 2250);
            this.add.tween(this.text17).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.Out, true, 2500);
            this.add.tween(this.text16).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.Out, true, 2750);
            this.add.tween(this.text15).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.Out, true, 3000);
            this.add.tween(this.text14).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.Out, true, 3250);
            this.add.tween(this.text13).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.In, true, 3500);
            this.add.tween(this.text12).to({ y: this.game.height + 100 }, 500, Phaser.Easing.Exponential.In, true, 3500).onComplete.addOnce(this.storyLine8, this);
        }

        storyLine8() {
            this.text20 = this.add.text(this.game.width + 160, this.game.height - 100, 'Nothing seems right...', this.style);
            this.text20.anchor.setTo(0.5, 0.5);
            this.text21 = this.add.text(-160, this.game.height - 70, '...and everything feels wrong', this.style);
            this.text21.anchor.setTo(0.5, 0.5);

            this.add.tween(this.text20).to({ x: this.game.world.centerX + 20 }, 750, Phaser.Easing.Exponential.In, true, 500);
            this.add.tween(this.text21).to({ x: this.game.world.centerX - 20 }, 750, Phaser.Easing.Exponential.In, true, 1000).onComplete.addOnce(this.storyLine9, this);
        }

        storyLine9() {
            this.add.tween(this.text20).to({ x: -160 }, 750, Phaser.Easing.Exponential.In, true, 3500);
            this.add.tween(this.text21).to({ x: this.game.width + 160 }, 750, Phaser.Easing.Exponential.In, true, 4500).onComplete.addOnce(this.storyLine10, this);
        }

        storyLine10() {
            this.text22 = this.add.text(50, this.game.height - 100, 'Oh well...', this.style);
            this.text23 = this.add.text(50, this.game.height - 70, '...at least i tried.', this.style);
            this.text24 = this.add.text(50, this.game.height - 40, 'ENJOY!', this.style);
            this.text22.alpha = 0;
            this.text23.alpha = 0;
            this.text24.alpha = 0;

            this.add.tween(this.text22).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.text23).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.text24).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.addOnce(this.storyLine11, this);
        }

        storyLine11() {
            this.add.tween(this.text22).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 3000);
            this.add.tween(this.text23).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 3500);
            this.add.tween(this.text24).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 4000);
        }
    }
}