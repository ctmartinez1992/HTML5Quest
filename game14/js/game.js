Game14.Game = function (game) {
    this.game = game;
};

	var PLAYER_MAX_SPEED = 750;			//Player max speed
	var PLAYER_ACCELERATION = 1500;		//Player acceleration
	var PLAYER_DRAG = 1000;				//Player drag, slide coefficient
    var PLAYER_JUMP_SPEED = -1200; 		//Player jump
    var PLAYER_JUMP_HOLD = 150;  		//Hold the button for player to jump more
	var GRAVITY = 2600; 				//Gravity constant

Game14.Game.prototype = {
	create: function () {
		//Necessary stuff
        this.sound.stopAll();
		
		//juicy juicy
		this.juicy = this.game.plugins.add(new Phaser.Plugin.Juicy(this));
		
		this.game.stage.backgroundColor = 0x666666;
		
		//Control variables
		doUpdate = true;
		paused = false;
		this.dead = false;
		this.shouldThunder = false;
		
		//Arcade physics
		this.game.physics.arcade.gravity.y = GRAVITY;

		//Player controls
		this.canDoubleJump = true;
		this.canVariableJump = true;
		
		//Map creation
		this.map = this.game.add.tilemap('map_json');
		this.map.addTilesetImage('tiles_spritesheet', 'tileset');
        this.map.setCollisionBetween(0, 10);
		this.layer = this.map.createLayer('tiles');
		this.layer.resizeWorld();

		//Player score
        this.game.score = 0;

		//Player
        this.player = this.add.sprite(400, 1000, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.animations.add('idle', [0]);
		this.player.animations.add('walk', [1,2,3]);
		this.player.animations.add('jump', [4]);
		this.player.body.collideWorldBounds = true;
		this.player.body.maxVelocity.setTo(PLAYER_MAX_SPEED, PLAYER_MAX_SPEED);
		this.player.body.drag.setTo(PLAYER_DRAG, 0);
		
		//Camera follows player
		//this.game.camera.follow(this.player);
		
		//Capture certain keys to prevent their default actions in the browser.
		//This is only necessary because this is an HTML5 game. Games on other platforms may not need code like this.
		this.game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN,
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.SPACE
		]);
		
		this.game.physics.arcade.TILE_BIAS = 24;
		
		
		//Explosions and lightning
		this.explosionGroup = this.game.add.group();
		this.lightningBitmap = this.game.add.bitmapData(200, 1000);
		this.lightning = this.game.add.image(this.game.width / 2, 80, this.lightningBitmap);
		this.lightning.filters = [ this.game.add.filter('Glow') ];
		this.lightning.anchor.setTo(0.5, 0);
		
		
		//Audio
		//this.winSound = game.add.audio('win_sound');
		//this.extraSound = game.add.audio('extra_sound');
		//this.jumpSound = game.add.audio('jump_sound');

		//FPS Text
		this.game.time.advancedTiming = true;
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
			if (!this.dead) {
				//Check if it's alive
				if (!this.checkAlive()) {
					this.quitGame();
				}
				
				//Update camera
				this.game.camera.x += 8;
				this.game.camera.y = this.player.y - 300;

				//Set collision callbacks
				this.game.physics.arcade.collide(this.player, this.layer);

				//Update the player
				this.updatePlayer();
				
				//Lightning
				this.shouldThunder = (this.game.rnd.integerInRange(1, 100000) > 99900);
				if (this.shouldThunder) {
					this.lightning.x = this.game.rnd.integerInRange(this.game.camera.x + 200, this.game.camera.x + 600)
					this.lightning.y = this.game.camera.y - 50;
				
					// Rotate the lightning sprite so it goes in the
					// direction of the pointer
					var usedX = this.game.rnd.integerInRange(this.lightning.x - 300, this.lightning.x + 300);
					var usedY =	this.game.rnd.integerInRange(this.lightning.y + 200, this.lightning.y + 550);
					this.lightning.rotation =
						this.game.math.angleBetween(this.lightning.x, this.lightning.y, usedX, usedY) - Math.PI/2;

					// Calculate the distance from the lightning source to the pointer
					var distance = this.game.math.distance(
							this.lightning.x, this.lightning.y,
							usedX, usedY
						);

					// Create the lightning texture
					this.createLightningTexture(this.lightningBitmap.width/2, 0, 20, 3, false, distance);

					// Make the lightning sprite visible
					this.lightning.alpha = 1;

					// Fade out the lightning sprite using a tween on the alpha property.
					this.game.add.tween(this.lightning)
						.to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
						.to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
						.to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
						.to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
						.to({ alpha: 0 }, 250, Phaser.Easing.Cubic.In)
						.start();
				}
				
				//Set score
				this.textScore.text = "SCORE: " + this.game.score;
			} else {
				
			}
        }		
    },
	
	updatePlayer: function() {
		var enterLeft = false;
		var enterRight = false;
	
		//Left and right movement
		if (this.leftInputIsActive()) {
			this.player.body.acceleration.x = -PLAYER_ACCELERATION;
			this.player.animations.play('walk', 15, true);
			enterLeft = true;
		} else if (this.rightInputIsActive()) {
			this.player.body.acceleration.x = PLAYER_ACCELERATION;
			this.player.animations.play('walk', 15, true);
			enterRight = true;
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
		
		if (!onTheGround) {
			this.player.animations.play('jump', 1, false);
		}

		//150 ms of jump difference
		if (this.canVariableJump && this.upInputIsActive(PLAYER_JUMP_HOLD)) {
			this.player.body.velocity.y = PLAYER_JUMP_SPEED;
			//if (!this.jumpSound.isPlaying) {
				//this.jumpSound.play('', 0, 0.25);
			//}
		}

		//Don't allow variable jump height after the jump button is released
		if (!this.upInputIsActive()) {
			this.canVariableJump = false;
		}
		
		if (enterRight) {
			this.player.scale.x = 1;
		}
		if (enterLeft) {
			this.player.scale.x = -1;
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
		return (this.game.score != 777);
    },

	quitGame: function () {
		//Game Over. Go to GameOver Screen
        if (!this.dead) {
            this.dead = true;
			//this.winSound.play('', 0, 0.5);
			Fade.fadeOut('GameOver');
        }
	},
	
	createLightningTexture: function(x, y, segments, boltWidth, branch, distance) {
		// Get the canvas drawing context for the lightningBitmap
		var ctx = this.lightningBitmap.context;
		var width = this.lightningBitmap.width;
		var height = this.lightningBitmap.height;

		// Our lightning will be made up of several line segments starting at
		// the center of the top edge of the bitmap and ending at the target.

		// Clear the canvas
		if (!branch) ctx.clearRect(0, 0, width, height);

		// Draw each of the segments
		for(var i = 0; i < segments; i++) {
			// Set the lightning color and bolt width
			ctx.strokeStyle = 'rgb(255, 255, 255)';
			ctx.lineWidth = boltWidth;

			ctx.beginPath();
			ctx.moveTo(x, y);

			// Calculate an x offset from the end of the last line segment and
			// keep it within the bounds of the bitmap
			if (branch) {
				// For a branch
				x += this.game.rnd.integerInRange(-10, 10);
			} else {
				// For the main bolt
				x += this.game.rnd.integerInRange(-30, 30);
			}
			if (x <= 10) x = 10;
			if (x >= width-10) x = width-10;

			// Calculate a y offset from the end of the last line segment.
			// When we've reached the target or there are no more segments left,
			// set the y position to the distance to the target. For branches, we
			// don't care if they reach the target so don't set the last coordinate
			// to the target if it's hanging in the air.
			if (branch) {
				// For a branch
				y += this.game.rnd.integerInRange(10, 20);
			} else {
				// For the main bolt
				y += this.game.rnd.integerInRange(20, distance/segments);
			}
			if ((!branch && i == segments - 1) || y > distance) {
				// This causes the bolt to always terminate at the center
				// lightning bolt bounding box at the correct distance to
				// the target. Because of the way the lightning sprite is
				// rotated, this causes this point to be exactly where the
				// player clicked or tapped.
				y = distance;
				if (!branch) x = width/2;
			}

			// Draw the line segment
			ctx.lineTo(x, y);
			ctx.stroke();

			// Quit when we've reached the target
			if (y >= distance) break;

			// Draw a branch 20% of the time off the main bolt only
			if (!branch) {
				if (this.game.math.chanceRoll(20)) {
					// Draws another, thinner, bolt starting from this position
					this.createLightningTexture(x, y, 10, 1, true, distance);
				}
			}
		}

		// This just tells the engine it should update the texture cache
		this.lightningBitmap.dirty = true;
	}
};

Phaser.Filter.Glow = function (game) {
    Phaser.Filter.call(this, game);

    this.fragmentSrc = [
        "precision lowp float;",
        "varying vec2 vTextureCoord;",
        "varying vec4 vColor;",
        'uniform sampler2D uSampler;',

        'void main() {',
            'vec4 sum = vec4(0);',
            'vec2 texcoord = vTextureCoord;',
            'for(int xx = -4; xx <= 4; xx++) {',
                'for(int yy = -3; yy <= 3; yy++) {',
                    'float dist = sqrt(float(xx*xx) + float(yy*yy));',
                    'float factor = 0.0;',
                    'if (dist == 0.0) {',
                        'factor = 2.0;',
                    '} else {',
                        'factor = 2.0/abs(float(dist));',
                    '}',
                    'sum += texture2D(uSampler, texcoord + vec2(xx, yy) * 0.002) * factor;',
                '}',
            '}',
            'gl_FragColor = sum * 0.025 + texture2D(uSampler, texcoord);',
        '}'
    ];
};

Phaser.Filter.Glow.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Glow.prototype.constructor = Phaser.Filter.Glow;