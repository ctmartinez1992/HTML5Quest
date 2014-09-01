Game11.Game = function (game) {
    this.game = game;
};

	var PLAYER_MAX_SPEED = 500;			//Player max speed
	var PLAYER_ACCELERATION = 1500;		//Player acceleration
	var PLAYER_DRAG = 600;				//Player drag, slide coefficient
    var PLAYER_JUMP_SPEED = -1000;  	//Player jump
    var PLAYER_JUMP_HOLD = 300;  		//Hold the button for player to jump more
	var GRAVITY = 2600; 				//Gravity constant

Game11.Game.prototype = {
	create: function () {
		//Necessary stuff
        this.sound.stopAll();		
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//Background
		this.game.stage.backgroundColor = 0x886A08;		
        //this.bg = this.add.sprite(0, 0, 'bg');
		
		//Control variables
		doUpdate = true;
		paused = false;
		this.dead = false;

		//Player score
        this.game.score = 0;

		//Player
        this.player = this.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.collideWorldBounds = true;
		this.player.body.maxVelocity.setTo(PLAYER_MAX_SPEED, PLAYER_MAX_SPEED);
		this.player.body.drag.setTo(PLAYER_DRAG, 0);

		//Group creation for different platforms and extras
        this.platform1 = this.game.add.group();
        this.extra1 = this.game.add.group();
        //this.platform1.createMultiple(30, 'platform1');
        //this.extra1.createMultiple(5, 'extra1');

		//Enable physics on ball, platforms and extras
        this.game.physics.enable(this.player);
        this.game.physics.enable(this.platform1);
        this.game.physics.enable(this.extra1);
		
		//Arcade physics
		this.game.physics.arcade.gravity.y = GRAVITY;

		//Player controls
		this.canDoubleJump = true;
		this.canVariableJump = true;
        this.cursors = this.game.input.keyboard.createCursorKeys();
		
		//Capture certain keys to prevent their default actions in the browser.
		//This is only necessary because this is an HTML5 game. Games on other platforms may not need code like this.
		this.game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN,
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.SPACE
		]);
		
		//Audio
		//this.landSound = game.add.audio('land');

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
	},

    spawnPlatform: function () {
		//Generate some random numbers for type and position
        var initX = this.game.rnd.integerInRange(0, this.game.world.width);
        var initY = this.game.rnd.integerInRange(0, this.game.world.height);
		
		//Spawn an extra if possible
		this.spawnExtra(initX, initY);
		
		//Set the platform
        this.createPlatform("1", initX, initY);
		
		//Schedule next platform spawn
        this.platformTimer = this.game.time.events.add(Phaser.Timer.SECOND * this.game.rnd.integerInRange(1, 2), this.spawnPlatform, this);
        this.platformTimer.autoDestroy = true;
    },

    createPlatform: function (type, initX, initY) {
        var usePlatform = this['platform' + type].getFirstDead();
        if (usePlatform !== null) {
            usePlatform.reset(initX, initY);
            usePlatform.outOfBoundsKill = true;
            usePlatform.checkWorldBounds = true;
            usePlatform.body.immovable = true;
            usePlatform.body.checkCollision.up = true;
            usePlatform.body.checkCollision.down = true;
            usePlatform.body.checkCollision.left = true;
            usePlatform.body.checkCollision.right = true;
        }
    },
	
	spawnExtra: function (initX, initY) {
        if (Math.random() > 0.75) {
			var initXExtra = initX + this.game.rnd.integerInRange(-100, 100)
			var initYExtra = initY + this.game.rnd.integerInRange(-100, 100) ;
			var randomExtra = this.game.rnd.integerInRange(1, 2);
			if(randomExtra == 1) {
				var extra1 = this.extra1.getFirstDead();
				if (extra1 !== null) {
					extra1.reset(initXExtra, initYExtra);
					extra1.outOfBoundsKill = true;
					extra1.checkWorldBounds = true;
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

			//Set collision callbacks
			this.game.physics.arcade.overlap(this.ball, this.extra1, this.getExtraCallback1, null, this);
			this.game.physics.arcade.collide(this.platform1, this.ball);
			
			//Update the player
			this.updatePlayer();
			
			//Set score
			this.textScore.text = "SCORE: " + this.game.score;
        }		
    },
	
	updatePlayer: function() {
		//Left and right movement
		if (this.leftInputIsActive()) {
			this.player.body.acceleration.x = -this.ACCELERATION;
		} else if (this.rightInputIsActive()) {
			this.player.body.acceleration.x = this.ACCELERATION;
		} else {
			this.player.body.acceleration.x = 0;
		}

		//Is the player touching the ground?
		var onTheGround = this.player.body.touching.down;
		if (onTheGround) {
			this.canDoubleJump = true;
		}

		//Allow the player to adjust his jump height by holding the jump button
		if (this.upInputIsActive(5)) {
			if (this.canDoubleJump) {
				this.canVariableJump = true;
			}

			//Jump when the player is touching the ground or they can double jump
			if (this.canDoubleJump || onTheGround) {
				this.player.body.velocity.y = PLAYER_JUMP_SPEED;
				if (!onTheGround) {
					this.canDoubleJump = false;
				}
			}
		}

		//150 ms of jump difference
		if (this.canVariableJump && this.upInputIsActive(PLAYER_JUMP_HOLD)) {
			this.player.body.velocity.y = PLAYER_JUMP_SPEED;
		}

		//Don't allow variable jump height after the jump button is released
		if (!this.upInputIsActive()) {
			this.canVariableJump = false;
		}
	},
	

	leftInputIsActive: function() {
		var isActive = false;
		isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
		isActive |= (this.game.input.activePointer.isDown && this.game.input.activePointer.x < (this.game.width / 4));
		return isActive;
	},


	rightInputIsActive: function() {
		var isActive = false;
		isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
		isActive |= (this.game.input.activePointer.isDown && this.game.input.activePointer.x > ((this.game.width / 2) + (this.game.width / 4)));
		return isActive;
	};


	upInputIsActive: function(duration) {
		var isActive = false;
		isActive = this.input.keyboard.justPressed(Phaser.Keyboard.UP, duration);
		isActive |= (this.game.input.activePointer.justPressed((duration + (1000 / 60))) &&
					(this.game.input.activePointer.x > (this.game.width / 4)) &&
					(this.game.input.activePointer.x < ((this.game.width / 2) + (this.game.width / 4)));
		return isActive;
	};
	
	checkAlive: function() {
		//Check if ball is still in game. This is what ends the game
		return true;
    },

    getExtraCallback1: function(ball, extra) {
        extra.kill();
		//Do something
        this.extraSound.play();
    },

	quitGame: function () {
		//Game Over. Go to GameOver Screen
        if (!this.dead) {
			this.lostSound.play();
            this.dead = true;
			this.ball.kill();
			Fade.fadeOut('GameOver');
        }
	}
};