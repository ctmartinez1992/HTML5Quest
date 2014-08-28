Game10.Game = function (game) {
    this.game = game;
    this.game.score = 0;
    this.game.highscore = 0;
};
		
	var spawnTime = 1;
	var spawnCounter = 0;
	var platformCounter = 0;
	var extraVelocityModifier = 1;

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
		
        this.initialVelocity = -100;
		this.levelVelocity = -100;
        this.game.score = 0;

        this.endModalBmp = this.game.add.bitmapData(160, 144);
        this.endModalBmp.context.lineWidth = 2;
        this.endModalBmp.context.fillStyle = 'rgba(136, 192, 112, 1)';

        this.modalLayer = this.game.add.sprite(0, 0, this.endModalBmp);

        this.ball = this.add.sprite(this.game.world.width / 2, 200, 'ball');

        this.platform1 = this.game.add.group();
        this.platform2 = this.game.add.group();
        this.platform3 = this.game.add.group();
        this.extra1 = this.game.add.group();
        this.platform1.createMultiple(30, 'platform1');
        this.platform2.createMultiple(30, 'platform2');
        this.platform3.createMultiple(30, 'platform3');
        this.extra1.createMultiple(5, 'extra1');

        this.game.physics.enable(this.ball);
        this.game.physics.enable(this.platform1);
        this.game.physics.enable(this.platform2);
        this.game.physics.enable(this.platform3);
        this.game.physics.enable(this.extra1);

        this.ball.body.bounce.set(1.0);
        this.ball.body.collideWorldBounds = false;
        this.ball.body.mass = 2;
        this.ball.body.gravity.y = 700;

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
        this.setPlatform('3', 200, 0, 300);
        this.platformTimer = this.game.time.events.add(Phaser.Timer.SECOND, this.spawnPlatform, this);
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

    spawnPlatform: function () {
		spawnCounter++;
        platformCounter++;
        this.game.score++;

        var type = this.game.rnd.integerInRange(1, 3);
        var platformLength = 1
        var initX = this.game.rnd.integerInRange(-50, 550 - (16 * platformLength));
        var initY = 600;
		
		//Calculate the next platform spawn time, increases difficult.
		if(spawnCounter > 30) {
			spawnTime += .1;
			if (spawnTime > 2.0) {
				spawnTime = 2.0;
			}
			spawnCounter = 0;
		}
		
		this.spawnExtra(initX, initY);

        while (platformLength--) {
            this.setPlatform(type, initX, platformLength, initY);
        }
		
        this.setVelocities(this.levelVelocity);
        this.platformTimer = this.game.time.events.add(Phaser.Timer.SECOND * this.game.rnd.integerInRange(1, spawnTime), this.spawnPlatform, this);
        this.platformTimer.autoDestroy = true;
    },
	
	spawnExtra: function (initX, initY) {
        var initYExtra = initY - (this.game.rnd.integerInRange(25, 50) * extraVelocityModifier);	
        if (platformCounter > 10 && Math.random() > 0.95) {
			if(this.game.rnd.integerInRange(1, 2)) {
				var extra1 = this.extra1.getFirstDead();
				if (extra1 !== null) {
					extra1.reset((initX + this.game.rnd.integerInRange(10, 100)), initYExtra);
					extra1.outOfBoundsKill = true;
					extra1.checkWorldBounds = true;
				}
			}
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

			this.game.physics.arcade.overlap(this.ball, this.extra1, this.getExtraCallback1, null, this);
			//this.game.physics.arcade.overlap(this.ball, this.extra2, this.getExtraCallback2, null, this);
			//this.game.physics.arcade.overlap(this.ball, this.extra3, this.getExtraCallback3, null, this);
			this.game.physics.arcade.collide(this.platform1, this.ball);
			this.game.physics.arcade.collide(this.platform2, this.ball);
			this.game.physics.arcade.collide(this.platform3, this.ball);

			this.levelVelocity = (this.initialVelocity - platformCounter) * extraVelocityModifier;
			
			this.textScore.text = "SCORE: " + this.game.score;
        }		
    },
	
	updatePlayer: function() {
        if (this.cursors.left.isDown) {
            this.ball.body.velocity.x = -150;
        }

        if (this.cursors.right.isDown) {
            this.ball.body.velocity.x = 150;
        }
	},
	
	checkAlive: function() {
        return ((this.ball.y > -24) && (this.ball.y < (this.game.world.height + 24)));
    },

    getExtraCallback1: function(ball, extra) {
        extra.kill();
        this.game.score += 10;
        //this.game.audio.touch.play();
    },

	quitGame: function () {
        if (!this.dead) {
            this.dead = true;
			this.ball.kill();
			Fade.fadeOut('GameOver');
        }
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
        this.platform3.setAll('body.velocity.y', velocity);
        this.extra1.setAll('body.velocity.y', velocity);
    }
};