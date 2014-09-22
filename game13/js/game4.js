Game13.Game4 = function (game) {
    this.game = game;
};

	var DRAG = 0;						//Drag, slide coefficient
	var GRAVITY = 50; 					//Gravity constant
	
	var PLAYER_MAX_SPEED = 750;			//Player max speed
	var PLAYER_ACCELERATION = 1500;		//Player acceleration
    var PLAYER_JUMP_SPEED = -1200; 		//Player jump
    var PLAYER_JUMP_HOLD = 150;  		//Hold the button for player to jump more
	
	var SHIP_ROTATION_SPEED = 180; 		//The ship rotation
    var SHIP_ACCELERATION = 200; 		//The ship acceleration
    var SHIP_MAX_SPEED = 250; 			//The ships max speed

Game13.Game4.prototype = {
	create: function () {
		//Necessary stuff
        this.sound.stopAll();
		
		//juicy juicy
		this.juicy = this.game.plugins.add(new Phaser.Plugin.Juicy(this));
		
		this.game.stage.backgroundColor = 0x224466;
		
		//Control variables
		doUpdate = true;
		paused = false;
		this.dead = false;
		this.done = false;
		
		this.hp = 1000;
		this.maxhp = 1000;
		
		//Life
		this.livesGroup = this.game.add.group();
		var liveStartX = -((25 * Game13.lives) / 2);
		for(var x = liveStartX; x < -liveStartX; x += 25) {
			var lifeBlock = this.game.add.sprite((this.game.world.width / 2) + x, 40, 'life');
			this.livesGroup.add(lifeBlock);
		}
		
		//Pad
		this.pad = this.game.add.sprite(748, 224, 'pad');
		this.pad.anchor.setTo(0.5, 1);
		this.game.physics.enable(this.pad, Phaser.Physics.ARCADE);
		this.pad.body.immovable = true;
		this.pad.body.allowGravity = false;
		
		//Ship
		this.ship = this.game.add.sprite(0, 0, 'ship');
		this.ship.anchor.setTo(0.5, 0.5);
		this.ship.angle = -90;

		this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = GRAVITY;
		this.ship.body.maxVelocity.setTo(SHIP_MAX_SPEED, SHIP_MAX_SPEED);
		this.ship.body.bounce.setTo(0.25, 0.25);
		this.ship.body.drag.setTo(DRAG, DRAG);
		this.ship.body.collideWorldBounds = true;
		this.resetShip();

		this.ground = this.game.add.group();
		for(var x = 688 ; x < this.game.width; x += 32) {
			var groundBlock = this.game.add.sprite(x, 224, 'ground');
			this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
			groundBlock.body.immovable = true;
			groundBlock.body.allowGravity = false;
			this.ground.add(groundBlock);
		}
		for(var x = 0; x < this.game.width; x += 32) {
			var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
			this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
			groundBlock.body.immovable = true;
			groundBlock.body.allowGravity = false;
			this.ground.add(groundBlock);
		}
		for(var y = 0; y < this.game.height - 192; y += 32) {
			var groundBlock = this.game.add.sprite(this.game.width / 2 - 100, y, 'block');
			this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
			groundBlock.body.immovable = true;
			groundBlock.body.allowGravity = false;
			this.ground.add(groundBlock);
		}
		for(var y = 96; y < this.game.height - 32; y += 32) {
			var groundBlock = this.game.add.sprite(this.game.width / 2 - 230, y, 'block');
			this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
			groundBlock.body.immovable = true;
			groundBlock.body.allowGravity = false;
			this.ground.add(groundBlock);
		}
		for(var y = 0; y < this.game.height - 192; y += 32) {
			var groundBlock = this.game.add.sprite(this.game.width / 2 + 160, y, 'block');
			this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
			groundBlock.body.immovable = true;
			groundBlock.body.allowGravity = false;
			this.ground.add(groundBlock);
		}
		for(var y = 96; y < this.game.height - 32; y += 32) {
			var groundBlock = this.game.add.sprite(this.game.width / 2 + 30, y, 'block');
			this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
			groundBlock.body.immovable = true;
			groundBlock.body.allowGravity = false;
			this.ground.add(groundBlock);
		}

		// Create a group for explosions
		this.explosionGroup = this.game.add.group();
		
		//Capture certain keys to prevent their default actions in the browser.
		//This is only necessary because this is an HTML5 game. Games on other platforms may not need code like this.
		this.game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN
		]);
		
		//Audio
		this.explosionSound = game.add.audio('explosion');
		this.shipSound = game.add.audio('shipSound');

		//FPS Text
		this.game.time.advancedTiming = true;
		this.textFPS = game.add.text(20, 20, '', { font: "12px Chunk", fill: "#ffffff", align: "center" });
        this.textFPS.anchor.setTo(0, 0);
		this.textFPS.fixedToCamera = true;
		
		//Score Text
        this.textScore = game.add.text(game.camera.width - 20, 20, "SCORE: " + Game13.score, { font: "12px Chunk", fill: "#ffffff", align: "center" });
        this.textScore.anchor.setTo(1, 0);
		this.textScore.fixedToCamera = true;
		this.textFPS.fixedToCamera = true;
		
		//HP Text
        this.textHP = game.add.text(game.camera.width / 2, 20, "HP: " + this.hp + "/" + this.maxhp, { font: "12px Chunk", fill: "#ffffff", align: "center" });
        this.textHP.anchor.setTo(0.5, 0);
		this.textHP.fixedToCamera = true;
		
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
			if (!this.dead) {
				//Check if it's alive
				if (!this.checkAlive()) {
					this.quitGame();
				}				

				this.game.physics.arcade.collide(this.ship, this.ground);
				this.game.physics.arcade.collide(this.ship, this.pad, this.searchWin);
				this.game.physics.arcade.collide(this.ground, this.pad);
				if (this.ship.x > this.game.width) {
					this.ship.x = 0;
				}					
				if (this.ship.x < 0) {
					this.ship.x = this.game.width;
				}

				//Update the player
				this.updatePlayer();
				
				//Set score
				this.textScore.text = "SCORE: " + Game13.score;
				this.textHP.text = "HP: " + this.hp + "/" + this.maxhp;
			} else {
				
			}
        }		
    },
	
	updatePlayer: function() {
		if (this.leftInputIsActive()) {
			this.ship.body.angularVelocity = -SHIP_ROTATION_SPEED;
		} else if (this.rightInputIsActive()) {
			this.ship.body.angularVelocity = SHIP_ROTATION_SPEED;
		} else {
			this.ship.body.angularVelocity = 0;
		}

		var onTheGround = this.ship.body.touching.down;
		var onTheTop = this.ship.body.touching.up;
		var onTheLeft = this.ship.body.touching.left;
		var onTheRight = this.ship.body.touching.right;
		var onThePad = this.pad.body.touching.up;

		if (onTheTop || onTheLeft || onTheRight || onTheGround) {
			if (Math.abs(this.ship.body.velocity.y) > 20 || Math.abs(this.ship.body.velocity.x) > 30) {
				this.hp -= Math.ceil(Math.abs((this.ship.body.velocity.y + this.ship.body.velocity.x)) * 3.0);
			} else if (Math.abs(this.ship.body.velocity.y) > 12 || Math.abs(this.ship.body.velocity.x) > 18) {
				this.hp -= Math.ceil(Math.abs((this.ship.body.velocity.y + this.ship.body.velocity.x)) * 0.5);
			}
		}
		
		if (onThePad && Math.abs(this.ship.body.velocity.y) <= 20 && Math.abs(this.ship.body.velocity.x) <= 30 && this.ship.angle < -75 && this.ship.angle > -105) {
			if (!this.done) {
				Game13.score += this.hp;
			}
			this.done = true;
			Fade.fadeOut('Game5');
			this.ship.body.angularVelocity = 0;
			this.ship.body.velocity.setTo(0, 0);
			this.ship.angle = -90;
		}
		
		if (this.hp <= 0) {
			this.explosionSound.play('', 0, 0.5);
			this.getExplosion(this.ship.x, this.ship.y);
			this.resetShip();
			this.hp = this.maxhp;
			Game13.lives -= 1;
			this.livesGroup.remove(this.livesGroup.getTop());
		}

		if (this.upInputIsActive()) {
			this.ship.body.acceleration.x = Math.cos(this.ship.rotation) * SHIP_ACCELERATION;
			this.ship.body.acceleration.y = Math.sin(this.ship.rotation) * SHIP_ACCELERATION;
			if (!this.shipSound.isPlaying) {
				this.shipSound.play('', 0, 0.3, true);
			}
		} else {
			this.ship.body.acceleration.setTo(0, 0);
			this.shipSound.stop();
		}
	},
	
	searchWin: function() {
		
	},
	
	checkAlive: function() {
		return !(Game13.lives <= 0);
    },

	quitGame: function () {
		//Game Over. Go to GameOver Screen
        if (!this.dead) {
            this.dead = true;
			//this.winSound.play('', 0, 0.5);
			Fade.fadeOut('GameOver');
        }
	},
	
	getExplosion: function(x, y) {
		var explosion = this.explosionGroup.getFirstDead();
		if (explosion === null) {
			explosion = this.game.add.sprite(0, 0, 'explosion');
			explosion.anchor.setTo(0.5, 0.5);
			
			var animation = explosion.animations.add('boom', [0, 1, 2, 3], 60, false);
			animation.killOnComplete = true;
			this.explosionGroup.add(explosion);
		}

		explosion.revive();
		explosion.x = x;
		explosion.y = y;
		explosion.angle = this.game.rnd.integerInRange(0, 360);
		explosion.animations.play('boom');
		
		return explosion;
	},

	resetShip: function() {
		this.ship.x = 32;
		this.ship.y = this.game.height - 60;
		this.ship.body.acceleration.setTo(0, 0);

		this.ship.angle = -90;
		this.ship.body.velocity.setTo(0, 0);
	},
	
	leftInputIsActive: function() {
		var isActive = false;
		isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
		isActive |= (this.game.input.activePointer.isDown && this.game.input.activePointer.x < this.game.width / 4);
		return isActive;
	},

	rightInputIsActive: function() {
		var isActive = false;
		isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
		isActive |= (this.game.input.activePointer.isDown && this.game.input.activePointer.x > this.game.width / 2 + this.game.width / 4);
		return isActive;
	},

	upInputIsActive: function() {
		var isActive = false;
		isActive = this.input.keyboard.isDown(Phaser.Keyboard.UP);
		isActive |= (this.game.input.activePointer.isDown && this.game.input.activePointer.x > this.game.width / 4 && this.game.input.activePointer.x < this.game.width / 2 + this.game.width / 4);
		return isActive;
	}
};