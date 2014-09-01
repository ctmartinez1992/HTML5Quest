Game10.Game = function (game) {
    this.game = game;
};
	
	
    var startVel = -100;
	var vel = -100;
	var dead = false;
	var spawnTime = 1;
	var spawnCounter = 0;
	var platformCounter = 0;
	var extraVelocityModifier = 1;
	var extraGravityModifier = 1;
	var extraDragModifier = 0;

Game10.Game.prototype = {
	create: function () {
        this.sound.stopAll();
		
		this.MAX_SPEED = 300;		//Ball max speed
		this.ACCELERATION = 300;	//Ball acceleration
		this.DRAG = 200;			//Ball drag, slide coefficient
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//Background
		game.stage.backgroundColor = 0x886A08;		
        this.bg = this.add.sprite(0, 0, 'bg');
		
		//Control variables
		doUpdate = true;
		paused = false;

		//Player score
        this.game.score = 0;
		
		//Starting  and current game velocity
        startVel = -100;
		vel = -100;
		
		//Spawn variables and extras modifiers.
		dead = false;
		spawnTime = 1;
		spawnCounter = 0;
		platformCounter = 0;
		extraVelocityModifier = 1;
		extraGravityModifier = 1;
		extraDragModifier = 0;

		//The ball
        this.ball = this.add.sprite(this.game.world.width / 2, 200, 'ball');
		this.ball.anchor.setTo(0.5, 0.5);

		//Group creation for different platforms and extras.
        this.platform1 = this.game.add.group();
        this.platform2 = this.game.add.group();
        this.platform3 = this.game.add.group();
        this.extra1 = this.game.add.group();
        this.extra2 = this.game.add.group();
        this.extra3 = this.game.add.group();
        this.platform1.createMultiple(30, 'platform1');
        this.platform2.createMultiple(30, 'platform2');
        this.platform3.createMultiple(30, 'platform3');
        this.extra1.createMultiple(5, 'extra1');
        this.extra2.createMultiple(5, 'extra2');
        this.extra3.createMultiple(5, 'extra3');

		//Enable physics on ball, platforms and extras.
        this.game.physics.enable(this.ball);
        this.game.physics.enable(this.platform1);
        this.game.physics.enable(this.platform2);
        this.game.physics.enable(this.platform3);
        this.game.physics.enable(this.extra1);
        this.game.physics.enable(this.extra2);
        this.game.physics.enable(this.extra3);
		
		//The ball body physics
        this.ball.body.collideWorldBounds = false;	//Don't collide with screen limits
		this.ball.body.bounce.set(0);				//No bounce
        this.ball.body.mass = 1;					//Small mass
        this.ball.body.gravity.y = 2000;			//Some gravity
		this.ball.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED);
		this.ball.body.drag.setTo(this.DRAG, 0);

		//Player controls, left and right
        this.cursors = this.game.input.keyboard.createCursorKeys();
		
		//Audio
		this.landSound = game.add.audio('land');
		this.extraSound = game.add.audio('extra');
		this.lostSound = game.add.audio('lost');

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
        this.createPlatform('3', 200, 0, 300);
        this.platformTimer = this.game.time.events.add(Phaser.Timer.SECOND, this.spawnPlatform, this);
	},

    createPlatform: function (type, initX, platformLength, initY) {
		//Reuse and reset platforms as needed/generated
        var usePlatformTile1 = this['platform' + type].getFirstDead();
        if (usePlatformTile1 !== null) {
            usePlatformTile1.reset(initX, initY);

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
		//Add control variables that monitor current number of platforms spawned and players score.
		spawnCounter++;
        platformCounter++;
        this.game.score++;

		//Generate some random numbers for type and position.
        var type = this.game.rnd.integerInRange(1, 3);
        var initX = this.game.rnd.integerInRange(-50, 550);
        var initY = 600;
		if (extraVelocityModifier == -1) {
			initY = -50;
		}
		
		//Calculate the next platform spawn time, increases difficult.
		if(spawnCounter > 25) {
			spawnTime += .1;
			if (spawnTime > 2.0) {
				spawnTime = 2.0;
			}
			spawnCounter = 0;
		}
		
		//Spawn an extra if possible
		this.spawnExtra(initX, initY);
		
		//Set the platform
        this.createPlatform(type, initX, 1, initY);
		
		//Adjust velocity for platforms and extras and schedule next platform spawn.
        this.setVelocities(vel);
        this.platformTimer = this.game.time.events.add(Phaser.Timer.SECOND * this.game.rnd.integerInRange(1, spawnTime), this.spawnPlatform, this);
        this.platformTimer.autoDestroy = true;
    },
	
	spawnExtra: function (initX, initY) {
		//Random extra generation, might not appear.
        if (platformCounter > 10 && Math.random() > 0.75) {
			//Random y and type.
			var initYExtra = initY - (this.game.rnd.integerInRange(25, 50) * extraVelocityModifier);
			var randomExtra = this.game.rnd.integerInRange(1, 4);
			if(randomExtra == 1) {
				var extra1 = this.extra1.getFirstDead();
				if (extra1 !== null) {
					extra1.reset((initX + this.game.rnd.integerInRange(10, 100)), initYExtra);
					extra1.outOfBoundsKill = true;
					extra1.checkWorldBounds = true;
				}
			}
			if(randomExtra == 2) {
				var extra2 = this.extra2.getFirstDead();
				if (extra2 !== null) {
					extra2.reset((initX + this.game.rnd.integerInRange(10, 100)), initYExtra);
					extra2.outOfBoundsKill = true;
					extra2.checkWorldBounds = true;
				}
			}
			if(randomExtra == 3) {
				var extra3 = this.extra3.getFirstDead();
				if (extra3 !== null) {
					extra3.reset((initX + this.game.rnd.integerInRange(10, 100)), initYExtra);
					extra3.outOfBoundsKill = true;
					extra3.checkWorldBounds = true;
				}
			}
        }
	},

	update: function () {
		//Quit game if user wants
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {            
			game.state.start('MainMenu');
        }
		
		//Set FPS
		if (this.game.time.fps !== 0) {
			this.textFPS.setText(game.time.fps + ' FPS');
		}
		
		//doUpdate
		if (doUpdate) {
			//Check if it's alive
			if (!this.checkAlive()) {
				this.quitGame();
			}
			
			//Change gravity if powerup was caught.
			this.ball.body.gravity.y = 2000 * extraVelocityModifier;
			
			//Too much gravity. Clamp values between 300 and -300 for better gameplay
			if (this.ball.body.velocity.y > 400) {
				this.ball.body.velocity.y = 400;
			}			
			if (extraVelocityModifier == -1) {
				if (this.ball.body.velocity.y < -400) {
					this.ball.body.velocity.y = -400;
				}
			}	

			//Have in consideration the gravity powerup. If caught, divide y velocity.			
			this.ball.body.velocity.y *= extraGravityModifier;
			
			//Maintain ball on screen even if it goes way to the left/right.
			if (this.ball.x > this.game.world.width + 16) {
				this.ball.x = -24;
			}
			if (this.ball.x < -24) {
				this.ball.x = this.game.world.width + 16;
			}

			//Set collision callbacks
			this.game.physics.arcade.overlap(this.ball, this.extra1, this.getExtraCallback1, null, this);
			this.game.physics.arcade.overlap(this.ball, this.extra2, this.getExtraCallback2, null, this);
			this.game.physics.arcade.overlap(this.ball, this.extra3, this.getExtraCallback3, null, this);
			this.game.physics.arcade.collide(this.platform1, this.ball);
			this.game.physics.arcade.collide(this.platform2, this.ball);
			this.game.physics.arcade.collide(this.platform3, this.ball);
			
			//Update the player
			this.updatePlayer();

			//Increase velocity to increase difficulty.
			vel = (startVel - platformCounter) * extraVelocityModifier;
			
			//Set score.
			this.textScore.text = "SCORE: " + this.game.score;
        }		
    },
	
	updatePlayer: function() {
		//Change acceleration depending on pressed key
        if (this.cursors.left.isDown) {
            this.ball.body.acceleration.x = -this.ACCELERATION;
        } else if (this.cursors.right.isDown) {
            this.ball.body.acceleration.x = this.ACCELERATION;
        } else {
            this.ball.body.acceleration.x = 0;
		}
	},
	
	checkAlive: function() {
		//Check if ball is still in game. This is what ends the game.
        return ((this.ball.y > -24) && (this.ball.y < (this.game.world.height + 24)));
    },

    getExtraCallback1: function(ball, extra) {
		//Score extra. Adds 10 to the score.
        extra.kill();
        this.game.score += 10;
        this.extraSound.play();
    },

    getExtraCallback2: function(ball, extra) {
		//Shift extra. Shifts ball, platform and extra direction.
        extra.kill();
        extraVelocityModifier = -1;
		vel = (startVel - platformCounter) * extraVelocityModifier;
		this.setVelocities(vel);
        this.game.time.events.add(Phaser.Timer.SECOND * 10, function() { 
			extraVelocityModifier = 1; vel = (startVel - platformCounter) * extraVelocityModifier; this.setVelocities(vel);}, this);
        this.extraSound.play();
    },

    getExtraCallback3: function(ball, extra) {
		//Gravity extra. Lower gravity.
        extra.kill();
        extraGravityModifier = 0.5;
        this.game.time.events.add(Phaser.Timer.SECOND * 10, function() { 
			extraGravityModifier = 1; }, this);
        this.extraSound.play();
    },

	quitGame: function () {
		//Game Over. Go to GameOver Screen.
        if (!dead) {
			this.lostSound.play();
            dead = true;
			this.ball.kill();
			Fade.fadeOut('GameOver');
        }
	},

    setVelocities: function (velocity) {
		//Sets the velocities for platforms and extras.
        this.platform1.setAll('body.velocity.y', velocity);
        this.platform2.setAll('body.velocity.y', velocity);
        this.platform3.setAll('body.velocity.y', velocity);
        this.extra1.setAll('body.velocity.y', velocity);
        this.extra2.setAll('body.velocity.y', velocity);
        this.extra3.setAll('body.velocity.y', velocity);
    }
};