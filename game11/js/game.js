Game11.Game = function (game) {
    this.game = game;
};

	var PLAYER_MAX_SPEED = 750;			//Player max speed
	var PLAYER_ACCELERATION = 1500;		//Player acceleration
	var PLAYER_DRAG = 400;				//Player drag, slide coefficient
    var PLAYER_JUMP_SPEED = -1200; 		//Player jump
    var PLAYER_JUMP_HOLD = 150;  		//Hold the button for player to jump more
	var GRAVITY = 2600; 				//Gravity constant

Game11.Game.prototype = {
	create: function () {
		//Necessary stuff
        this.sound.stopAll();
		
		//juicy juicy
		this.juicy = this.game.plugins.add(new Phaser.Plugin.Juicy(this));		
		
		//Background
		this.rC = 0;
		this.gC = 0;
		this.bC = 0;
		this.rI = 1;
		this.gI = 1;
		this.bI = 1;
		
		//Control variables
		doUpdate = true;
		paused = false;
		this.dead = false;
		
		//Arcade physics
		this.game.physics.arcade.gravity.y = GRAVITY;

		//Player controls
		this.canDoubleJump = true;
		this.canVariableJump = true;
		
		//Map creation
		this.map = this.game.add.tilemap('map_json');
		this.map.addTilesetImage('tiles_spritesheet', 'tileset');
        this.map.setCollisionBetween(2, 10);
        this.map.setCollisionBetween(12, 20);
        this.map.setCollisionBetween(22, 30);
        this.map.setCollisionBetween(32, 40);
        this.map.setCollisionBetween(42, 50);
        this.map.setCollisionBetween(52, 60);
        this.map.setCollisionBetween(62, 70);
        this.map.setCollisionBetween(72, 80);
        this.map.setCollisionBetween(82, 90);
        this.map.setCollisionBetween(92, 100);
        this.map.setCollisionBetween(112, 120);
		this.layer = this.map.createLayer('tiles');
		this.layer.resizeWorld();

		//Player score
        this.game.score = 0;

		//Player
        this.player = this.add.sprite(100, 2000, 'player');
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.animations.add('idle', [0]);
		this.player.animations.add('walk', [1,2]);
		this.player.body.collideWorldBounds = true;
		this.player.body.maxVelocity.setTo(PLAYER_MAX_SPEED, PLAYER_MAX_SPEED);
		this.player.body.drag.setTo(PLAYER_DRAG, 0);
		
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
		
		//Coins
        this.extra1 = this.game.add.sprite(1080, 2040, 'coin');  		this.game.physics.enable(this.extra1, Phaser.Physics.ARCADE);		this.extra1.body.collideWorldBounds = true;
        this.extra2 = this.game.add.sprite(708, 2316, 'coin');			this.game.physics.enable(this.extra2, Phaser.Physics.ARCADE);		this.extra2.body.collideWorldBounds = true;
        this.extra3 = this.game.add.sprite(708, 2388, 'coin');			this.game.physics.enable(this.extra3, Phaser.Physics.ARCADE);		this.extra3.body.collideWorldBounds = true;
        this.extra4 = this.game.add.sprite(3120, 324, 'coin');			this.game.physics.enable(this.extra4, Phaser.Physics.ARCADE);		this.extra4.body.collideWorldBounds = true;
        this.extra5 = this.game.add.sprite(6900, 2172, 'coin');			this.game.physics.enable(this.extra5, Phaser.Physics.ARCADE);		this.extra5.body.collideWorldBounds = true;
        this.extra6 = this.game.add.sprite(15180, 756, 'coin');			this.game.physics.enable(this.extra6, Phaser.Physics.ARCADE);		this.extra6.body.collideWorldBounds = true;
        this.extra7 = this.game.add.sprite(20024, 1236, 'coin');		this.game.physics.enable(this.extra7, Phaser.Physics.ARCADE);		this.extra7.body.collideWorldBounds = true;
		this.extra1.body.allowGravity = false;		this.extra1.body.gravity = 0;
		this.extra2.body.allowGravity = false;		this.extra2.body.gravity = 0;
		this.extra3.body.allowGravity = false;		this.extra3.body.gravity = 0;
		this.extra4.body.allowGravity = false;		this.extra4.body.gravity = 0;
		this.extra5.body.allowGravity = false;		this.extra5.body.gravity = 0;
		this.extra6.body.allowGravity = false;		this.extra6.body.gravity = 0;
		this.extra7.body.allowGravity = false;		this.extra7.body.gravity = 0;
		this.extra1.anchor.setTo(0.5, 0.5);
		this.extra2.anchor.setTo(0.5, 0.5);
		this.extra3.anchor.setTo(0.5, 0.5);
		this.extra4.anchor.setTo(0.5, 0.5);
		this.extra5.anchor.setTo(0.5, 0.5);
		this.extra6.anchor.setTo(0.5, 0.5);
		this.extra7.anchor.setTo(0.5, 0.5);
		this.game.add.tween(this.extra1.scale).to( {x: 0.8, y: 0.8}, 1000, Phaser.Easing.Back.Linear, true, Number.MAX_VALUE, true).yoyo(true);
		this.game.add.tween(this.extra2.scale).to( {x: 0.8, y: 0.8}, 1000, Phaser.Easing.Back.Linear, true, Number.MAX_VALUE, true).yoyo(true);
		this.game.add.tween(this.extra3.scale).to( {x: 0.8, y: 0.8}, 1000, Phaser.Easing.Back.Linear, true, Number.MAX_VALUE, true).yoyo(true);
		this.game.add.tween(this.extra4.scale).to( {x: 0.8, y: 0.8}, 1000, Phaser.Easing.Back.Linear, true, Number.MAX_VALUE, true).yoyo(true);
		this.game.add.tween(this.extra5.scale).to( {x: 0.8, y: 0.8}, 1000, Phaser.Easing.Back.Linear, true, Number.MAX_VALUE, true).yoyo(true);
		this.game.add.tween(this.extra6.scale).to( {x: 0.8, y: 0.8}, 1000, Phaser.Easing.Back.Linear, true, Number.MAX_VALUE, true).yoyo(true);
		this.game.add.tween(this.extra7.scale).to( {x: 0.8, y: 0.8}, 1000, Phaser.Easing.Back.Linear, true, Number.MAX_VALUE, true).yoyo(true);
		
		//Audio
		this.winSound = game.add.audio('win_sound');
		this.extraSound = game.add.audio('extra_sound');
		this.jumpSound = game.add.audio('jump_sound');

		//FPS Text
		this.game.time.advancedTiming = true;
		this.textFPS = game.add.text(20, 20, '', { font: "12px Chunk", fill: "#ffffff", align: "center" });
        this.textFPS.anchor.setTo(0, 0);
		this.textFPS.fixedToCamera = true;
		
		//Score Text
        this.textScore = game.add.text(game.camera.width - 20, 20, "SCORE: " + game.score, { font: "12px Chunk", fill: "#ffffff", align: "center" });
        this.textScore.anchor.setTo(1, 0);
		this.textScore.fixedToCamera = true;
		
		//End Game
		this.textEnd = game.add.text(this.game.world.width / 2, this.game.world.height / 2 - 200, 'CONGRATULATION', { font: "28px Chunk", fill: "#ffffff", align: "center" });
        this.textEnd.anchor.setTo(0.5, 0.5);
        this.textEnd.alpha = 0;
		this.textEnd.fixedToCamera = true;
		this.textEnd2 = game.add.text(this.game.world.width / 2, this.game.world.height / 2, 'YOU GOT THE 7 COINS', { font: "20px Chunk", fill: "#ffffff", align: "center" });
        this.textEnd2.anchor.setTo(0.5, 0.5);
        this.textEnd2.alpha = 0;
		this.textEnd2.fixedToCamera = true;
		this.textEnd3 = game.add.text(this.game.world.width / 2, this.game.world.height / 2 + 150, 'PRESS ESCAPE TO LEAVE', { font: "14px Chunk", fill: "#ffffff", align: "center" });
        this.textEnd3.anchor.setTo(0.5, 0.5);
        this.textEnd3.alpha = 0;
		this.textEnd3.fixedToCamera = true;
		
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
			//Update background colour
			if (this.player.x > 7000 && this.player.x < 17000) {
				this.colorTrip2();
				this.colorVar = false;
			} else {
				this.colorTrip();
				this.colorVar = true;
			}
		
			if (!this.dead) {
				//Check if it's alive
				if (!this.checkAlive()) {
					this.quitGame();
				}

				//Set collision callbacks
				this.game.physics.arcade.collide(this.player, this.layer);
				this.game.physics.arcade.collide(this.extra1, this.layer);	
				this.game.physics.arcade.collide(this.extra2, this.layer);	
				this.game.physics.arcade.collide(this.extra3, this.layer);	
				this.game.physics.arcade.collide(this.extra4, this.layer);	
				this.game.physics.arcade.collide(this.extra5, this.layer);	
				this.game.physics.arcade.collide(this.extra6, this.layer);	
				this.game.physics.arcade.collide(this.extra7, this.layer);	
				this.game.physics.arcade.overlap(this.player, this.extra1, this.getExtraCallback, null, this);
				this.game.physics.arcade.overlap(this.player, this.extra2, this.getExtraCallback, null, this);
				this.game.physics.arcade.overlap(this.player, this.extra3, this.getExtraCallback, null, this);
				this.game.physics.arcade.overlap(this.player, this.extra4, this.getExtraCallback, null, this);
				this.game.physics.arcade.overlap(this.player, this.extra5, this.getExtraCallback, null, this);
				this.game.physics.arcade.overlap(this.player, this.extra6, this.getExtraCallback, null, this);
				this.game.physics.arcade.overlap(this.player, this.extra7, this.getExtraCallback, null, this);

				//Update the player
				this.updatePlayer();
				
				//Set score
				this.textScore.text = "SCORE: " + this.game.score;
			} else {
				
			}
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
			if (this.player.x <= 2000.0) {
				this.juicy.jelly(this.player, 1);
			}
			if (this.player.x > 2000.0 && this.player.x <= 4000.0) {
				this.juicy.jelly(this.player, 0.9);
			}
			if (this.player.x > 4000.0 && this.player.x <= 6000.0) {
				this.juicy.jelly(this.player, 0.8);
			}
			if (this.player.x > 6000.0 && this.player.x <= 8000.0) {
				this.juicy.jelly(this.player, 0.7);
			} 
			if (this.player.x > 8000.0 && this.player.x <= 10000.0) {
				this.juicy.jelly(this.player, 0.6);
			} 
			if (this.player.x > 10000.0 && this.player.x <= 12000.0) {
				this.juicy.jelly(this.player, 0.5);
			} 
			if (this.player.x > 12000.0 && this.player.x <= 14000.0) {
				this.juicy.jelly(this.player, 0.4);
			} 
			if (this.player.x > 14000.0 && this.player.x <= 16000.0) {
				this.juicy.jelly(this.player, 0.3);
			} 
			if (this.player.x > 16000.0 && this.player.x <= 18000.0) {
				this.juicy.jelly(this.player, 0.2);
			} 
			if (this.player.x > 18000.0 && this.player.x <= 20000.0) {
				this.juicy.jelly(this.player, 0.1);
			}
			
			this.player.body.velocity.y = PLAYER_JUMP_SPEED;
			if (!this.jumpSound.isPlaying) {
				this.jumpSound.play('', 0, 0.25);
			}
		}

		//Don't allow variable jump height after the jump button is released
		if (!this.upInputIsActive()) {
			this.canVariableJump = false;
		}
	},

    getExtraCallback: function(player, extra) {
        extra.kill();
        this.game.score += 111;
        this.extraSound.play('', 0, 0.5);
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
	
	colorTrip2: function() {
		if (this.colorVar) {
			this.rC = 0;
			this.gC = 0;
			this.bC = 0;
		}
		
		if (this.rC >= 220) {
			this.rI = -1;
		}
		if (this.rC <= 2) {
			this.rI = 1;
		}
		if (this.gC >= 220) {
			this.gI = -1;
		}
		if (this.gC <= 2) {
			this.gI = 1;
		}
		if (this.bC >= 220) {
			this.bI = -1;
		}
		if (this.bC <= 2) {
			this.bI = 1;
		}
		
		this.rC += (Math.abs(Math.sin(this.game.time.now * (180 / 3.14))) * 1.2) * this.rI;
		this.gC += (Math.abs(Math.sin(this.game.time.now * (180 / 3.14))) * 1.2) * this.gI;
		this.bC += (Math.abs(Math.sin(this.game.time.now * (180 / 3.14))) * 1.2) * this.bI;
		
		this.game.stage.backgroundColor = (this.rC << 16) | (this.gC << 8) | (this.bC);
	},
	
	colorTrip: function() {
		if (this.rC >= 250) {
			this.rI = -1;
		}
		if (this.rC <= 5) {
			this.rI = 1;
		}
		if (this.gC >= 250) {
			this.gI = -1;
		}
		if (this.gC <= 5) {
			this.gI = 1;
		}
		if (this.bC >= 250) {
			this.bI = -1;
		}
		if (this.bC <= 5) {
			this.bI = 1;
		}
		
		this.rC += (Math.abs(Math.sin(this.game.time.now * (180 / 3.14))) * 1.5) * this.rI;
		this.gC += (Math.abs(Math.cos(this.game.time.now * (180 / 3.14))) * 2) * this.gI;
		this.bC += (Math.abs(Math.sin(this.game.time.now * (180 / 3.14))) * 3) * this.bI;
		
		this.game.stage.backgroundColor = (this.rC << 16) | (this.gC << 8) | (this.bC);
	},
	
	checkAlive: function() {
		return (this.game.score != 777);
    },

	quitGame: function () {
		//Game Over. Go to GameOver Screen
        if (!this.dead) {
            this.dead = true;
			this.winSound.play('', 0, 0.5);
			Fade.fadeOut('GameOver');
        }
	}
};