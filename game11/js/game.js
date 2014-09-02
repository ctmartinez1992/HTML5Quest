Game11.Game = function (game) {
    this.game = game;
};

	var PLAYER_MAX_SPEED = 500;			//Player max speed
	var PLAYER_ACCELERATION = 1500;		//Player acceleration
	var PLAYER_DRAG = 600;				//Player drag, slide coefficient
    var PLAYER_JUMP_SPEED = -1600;  	//Player jump
    var PLAYER_JUMP_HOLD = 150;  		//Hold the button for player to jump more
	var GRAVITY = 2600; 				//Gravity constant

Game11.Game.prototype = {
	create: function () {
		//Necessary stuff
        this.sound.stopAll();		
		
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
        this.player = this.add.sprite(50, this.game.world.height / 2, 'player');
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.animations.add('idle', [0]);
		this.player.animations.add('walk', [1,2]);
		this.player.body.collideWorldBounds = true;
		this.player.body.maxVelocity.setTo(PLAYER_MAX_SPEED, PLAYER_MAX_SPEED);
		this.player.body.drag.setTo(PLAYER_DRAG, 0);
		
		//Arcade physics
		this.game.physics.arcade.gravity.y = GRAVITY;

		//Player controls
		this.canDoubleJump = true;
		this.canVariableJump = true;
		
		//The ground
		/*this.ground = this.game.add.group();
		for(var x = 0; x < this.game.width; x += 32) {
			var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
			this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
			groundBlock.body.immovable = true;
			groundBlock.body.allowGravity = false;
			this.ground.add(groundBlock);
		}*/
		
		//Map creation
		this.map = this.game.add.tilemap('map_json');
		this.map.addTilesetImage('tiles_spritesheet', 'tileset');
        this.map.setCollisionBetween(0, 100);
		this.layer = this.map.createLayer('tiles');
		this.layer.resizeWorld();
		
		//Camera follows player
		this.game.camera.follow(this.player);
		
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
			this.game.physics.arcade.collide(this.player, this.layer);	

			//Update the player
			this.updatePlayer();
			
			//Set score
			this.textScore.text = "SCORE: " + this.game.score;
        }		
    },
	
	updatePlayer: function() {
		//Left and right movement
		if (this.leftInputIsActive()) {
			this.player.body.acceleration.x = -PLAYER_ACCELERATION;
			this.player.animations.play('walk', 4, true);
		} else if (this.rightInputIsActive()) {
			this.player.body.acceleration.x = PLAYER_ACCELERATION;
			this.player.animations.play('walk', 8, true);
		} else {
			this.player.body.acceleration.x = 0;
			this.player.animations.play('idle', 1, false);
		}

		//Is the player touching the ground?
		var onTheGround = this.player.body.blocked.down;
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
	},

	upInputIsActive: function(duration) {
		var isActive = false;
		isActive = this.input.keyboard.justPressed(Phaser.Keyboard.UP, duration);
		isActive |= (this.game.input.activePointer.justPressed((duration + (1000 / 60))) &&
					(this.game.input.activePointer.x > (this.game.width / 4)) &&
					(this.game.input.activePointer.x < ((this.game.width / 2) + (this.game.width / 4))));
		return isActive;
	},
	
	checkAlive: function() {
		return true;
    },

	quitGame: function () {
		//Game Over. Go to GameOver Screen
        if (!this.dead) {
            this.dead = true;
			this.lostSound.play();
			this.player.kill();
			Fade.fadeOut('GameOver');
        }
	}
};