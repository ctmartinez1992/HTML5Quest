Game10.Game = function (game) {
    this.game = game;
    this.game.score = 0;
    this.game.highscore = 0;
};

Game10.Game.prototype = {
	create: function () {
        this.sound.stopAll();
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//Background
		game.stage.backgroundColor = 0x886A08;
		
		//Control variables
		doUpdate = true;
		paused = false;
		
		//Is it over?
		this.dead = false;
        this.initialVelocity = -10;
		this.levelVelocity = -10;
        this.platformCounter = 0;
        this.game.score = 0;

        this.endModalBmp = this.game.add.bitmapData(160, 144);
        this.endModalBmp.context.lineWidth = 2;
        this.endModalBmp.context.fillStyle = 'rgba(136, 192, 112, 1)';

        this.modalLayer = this.game.add.sprite(0, 0, this.endModalBmp);

        this.ball = this.add.sprite(this.game.world.width / 2, 20, 'ball');

        this.platform1 = this.game.add.group();
        this.platform2 = this.game.add.group();
        this.extra = this.game.add.group();
        this.platform1.createMultiple(30, 'platform');
        this.platform2.createMultiple(30, 'platform');
        //this.extra.createMultiple(5, 'extra1');

        this.game.physics.enable(this.ball);
        this.game.physics.enable(this.platform1);
        this.game.physics.enable(this.platform2);
        this.game.physics.enable(this.extra);

        this.ball.body.bounce.set(0.5);
        this.ball.body.collideWorldBounds = false;
        this.ball.body.mass = 1;
        this.ball.body.gravity.y = 200;

        this.cursors = this.game.input.keyboard.createCursorKeys();

		//FPS Text
		game.time.advancedTiming = true;
		this.textFPS = game.add.text(20, 20, '', { font: "12px Chunk", fill: "#ffffff", align: "center" });
        this.textFPS.anchor.setTo(0, 0);
		this.textFPS.fixedToCamera = true;
		
		//Score Text
        this.textScore = game.add.text(game.camera.width - 20, 20, "SCORE: " + game.score, { font: "12px Chunk", fill: "#ffffff", align: "center" });
        this.textScore.anchor.setTo(1, 0);
		this.textScore.fixedToCamera = true;
		
		//Initialize Pause function
		Pause.init();
		
		//Volume handler
		Volume.init(0, game.camera.height - 26);
		
		//Set platforms
        var i = 4;
        var firstLength = 3;

        while(firstLength--) {
            this.setPlatform('1', (this.game.world.width / 2), firstLength, 200);
        }

        while(i--) {
            var platformLength = this.game.rnd.integerInRange(1, 4);
            var initX = this.game.rnd.integerInRange(0, 160 - (16 * platformLength));

            while (platformLength--) {
                this.setPlatform('1', initX, platformLength, 96 + (200 * i));
            }
        }
		
        this.spawnPlatform();
	},

    setPlatform: function (type, initX, platformLength, initY) {
        var usePlatformTile1 = this['platform' + type].getFirstDead();

        if (usePlatformTile1 !== null) {
            usePlatformTile1.reset(initX + (16 * platformLength), initY);

            usePlatformTile1.outOfBoundsKill = true;
            usePlatformTile1.checkWorldBounds = true;

            usePlatformTile1.body.immovable = true;
            usePlatformTile1.body.checkCollision.up = true;
            usePlatformTile1.body.checkCollision.down = true;
            usePlatformTile1.body.checkCollision.left = true;
            usePlatformTile1.body.checkCollision.right = true;
        }
    },

	update: function () {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {            
			game.state.start('MainMenu');
        }
		
		if (this.game.time.fps !== 0) {
			this.textFPS.setText(game.time.fps + ' FPS');
		}
		
		if (doUpdate) {
			this.ball.body.velocity.x = 0;
			
			this.updatePlayer();
			this.checkBoundaries();

			if (!this.checkAlive()) {
				this.quitGame();
			}

			if (this.ball.body.velocity.y > 100) {
				this.ball.body.velocity.y = 100;
			}

			this.game.physics.arcade.overlap(this.ball, this.extra, this.getExtraCallback, null, this);
			this.game.physics.arcade.collide(this.platform1, this.ball);
			this.game.physics.arcade.collide(this.platform2, this.ball);

			this.levelVelocity = this.initialVelocity - this.platformCounter;
			
			this.textScore.text = "SCORE: " + this.game.score;
        }		
    },
	
	updatePlayer: function() {
        if (this.cursors.left.isDown) {
            this.ball.body.velocity.x = -60;
        }

        if (this.cursors.right.isDown) {
            this.ball.body.velocity.x = 60;
        }
	},
	
	checkAlive: function() {
        return ((this.ball.y > -24) && (this.ball.y < (this.game.world.height + 24)));
    },

    getExtraCallback: function(ball, extra) {
        extra.kill();
        this.game.score += 25;
        //this.game.audio.touch.play();
    },

	quitGame: function () {
        var newHighscore = (this.game.score >= this.game.highscore);

        if (!this.dead) {
            this.ball.kill();
            //this.game.audio.crash.play();
            this.game.time.events.remove(this.platformTimer);
            this.setVelocities(0);
            this.game.highscore = Math.max(this.game.highscore, this.game.score);
            this.showEndModal(newHighscore);
            var continueKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            continueKey.onUp.add(function() {
                this.ball.destroy();
                this.platform1.destroy();
                this.platform2.destroy();
                this.extra.destroy();
                this.modalLayer.destroy();
                this.endTextImg.destroy();

                this.game.state.start('MainMenu');
            }, this);

            this.dead = true;
        }
	},

    addTextElement: function (endTextValue) {
        var newText = this.game.add.retroFont('font', 8, 8, '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ:!?');
        newText.text = endTextValue;
        return newText;
    },

    showEndModal: function(isHighscore) {
        var endText = '';

        if (isHighscore) {
            endText += 'New Highscore!';
        } else {
            endText += 'No Highscore!';
        }

        this.modalLayer.bringToTop();

        this.endModalBmp.context.fillRect(16, 16, 128, 112);
        this.endModalBmp.dirty = true;

        this.endText = this.addTextElement(endText);
        this.endTextCtn = this.addTextElement('Press spacebar!');

        this.endTextImg = this.game.add.image(this.game.world.centerX, -16, this.endText);
        this.endTextCtnImg = this.game.add.image(this.game.world.centerX, this.game.world.centerY + 32, this.endTextCtn);
        this.endTextImg.anchor.setTo(0.5, 0.5);
        this.endTextCtnImg.anchor.setTo(0.5, 0.5);

        var bounce = this.game.add.tween(this.endTextImg);

        bounce.to({ y: this.game.world.centerY }, 2000, Phaser.Easing.Bounce.Out);
        bounce.start();
    },

    checkBoundaries: function() {
        if (this.ball.x > this.game.world.width + 16) {
            this.ball.x = -16;
        }

        if (this.ball.x < -16) {
            this.ball.x = this.game.world.width + 16;
        }
    },

    setVelocities: function (velocity) {
        this.platform1.setAll('body.velocity.y', velocity);
        this.platform2.setAll('body.velocity.y', velocity);
        this.extra.setAll('body.velocity.y', velocity);
    },

    spawnPlatform: function () {
        this.platformCounter++;
        this.game.score++;

        var type = this.game.rnd.integerInRange(1, 2);
        var platformLength = this.game.rnd.integerInRange(1, 3);
        var initX = this.game.rnd.integerInRange(0, 160 - (16 * platformLength));
        var initY = 160;
        var initYExtra = 160 - 10;
        var maxTimeToSpawn = (this.platformCounter > 44 ? 2 : 1);
        if (this.platformCounter > 5 && Math.random() > 0.65)  {
            var extra = this.extra.getFirstDead();
            if (extra !== null) {
                extra.reset(initX +12, initYExtra);
                extra.outOfBoundsKill = true;
                extra.checkWorldBounds = true;
            }
        }

        while (platformLength--) {
            this.setPlatform(type, initX, platformLength, initY);
        }
        this.setVelocities(this.levelVelocity);
        this.platformTimer = this.game.time.events.add(
            Phaser.Timer.SECOND * this.game.rnd.integerInRange(1,maxTimeToSpawn), this.spawnPlatform, this
        );
        this.platformTimer.autoDestroy = true;
    }
};