Game7.Game = function (game) {
    this.game = game;
    this.game.score = 0;
    this.game.highscore = 0;
};

//Constants
var PLAYER_ANGLE_INCREMENT = 2;						var ENEMY_ANGLE_INCREMENT = 2;
var PLAYER_ANGLE_MAXIMUM = 8;						var ENEMY_ANGLE_MAXIMUM = 8;

//Globals
var smashing = false;								var enemySmashing = false;
var jumping = false;								var enemyJumping = false;
var doubleJumping = false;							var enemyDoubleJumping = false;
var jumpTimer = 0;									var enemyJumpTimer = 0;
var smashTimer = 0;									var enemySmashTimer = 0;
var playerAngleMax = PLAYER_ANGLE_MAXIMUM;			var enemyAngleMax = ENEMY_ANGLE_MAXIMUM;
var playerAngleInc = PLAYER_ANGLE_INCREMENT;		var enemyAngleInc = ENEMY_ANGLE_INCREMENT;

var playerWonText;
var enemyWonText;

var playerLives;
var enemyLives;

var playerScored;
var enemyScored;

var hailing;

var soundJump;
var soundGoomba;
var music;

Game7.Game.prototype = {
	create: function () {
        this.sound.stopAll();
		
		//P2 is neat as fuck
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.setImpactEvents(true);
		this.game.physics.p2.gravity.y = 5000;
		
		//Background
		this.bg = game.add.sprite(this.world.centerX, this.world.centerY, 'bg');
		this.bg.anchor.setTo(0.5, 0.5);
		
		//Ground
		this.ground = game.add.sprite(this.world.centerX, this.world.height, 'ground');
		this.ground.anchor.setTo(0.5, 0.5);
		this.ground.scale.x = 2;
		this.game.physics.p2.enable(this.ground);
		this.ground.body.static = true;
		
		//Player
		this.player = game.add.sprite(250, this.world.centerY, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.player.visible = false;
		this.player.frame = 1;
		this.player.health = 100;
		this.game.physics.p2.enable(this.player);
		this.player.body.fixedRotation = true;
		
		//Player Image
		this.playerImage = game.add.sprite(250, this.world.centerY, 'player');
		this.playerImage.anchor.setTo(0.5, 0.5);
		
		//Enemy
		this.enemy = game.add.sprite(this.world.width - 250, this.world.centerY, 'enemy');
		this.enemy.anchor.setTo(0.5, 0.5);
		this.enemy.visible = false;
		this.enemy.frame = 0;
		this.enemy.health = 100;
		this.game.physics.p2.enable(this.enemy);
		this.enemy.body.fixedRotation = true;
		
		//Enemy Image
		this.enemyImage = game.add.sprite(this.world.width - 250, this.world.centerY, 'enemy');
		this.enemyImage.anchor.setTo(0.5, 0.5);
		this.enemyImage.frame = 1;
		
		//Player Hail
		this.playerHail = game.add.sprite(this.player.x, this.player.y, 'green_hail');
		this.playerHail.visible = false;
		
		//Enemy Hail
		this.enemyHail = game.add.sprite(this.enemy.x, this.enemy.y, 'purple_hail');
		this.enemyHail.visible = false;

		//Materials
		this.playerMaterial = game.physics.p2.createMaterial('playerMaterial', this.player.body);
		this.enemyMaterial = game.physics.p2.createMaterial('enemyMaterial', this.enemy.body);
		this.groundMaterial = game.physics.p2.createMaterial('groundMaterial', this.ground.body);
		this.worldMaterial = game.physics.p2.createMaterial('worldMaterial');		
		this.game.physics.p2.setWorldMaterial(this.worldMaterial, true, true, true, true);
		
		this.contactMaterial = game.physics.p2.createContactMaterial(this.playerMaterial, this.worldMaterial);
		this.contactMaterial.friction = 0.0;    		//Friction to use in the contact of these two materials.
		this.contactMaterial.restitution = 0.0;  		//Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
		this.contactMaterial.stiffness = 1e7;    		//Stiffness of the resulting ContactEquation that this ContactMaterial generate.
		this.contactMaterial.relaxation = 0;     		//Relaxation of the resulting ContactEquation that this ContactMaterial generate.
		this.contactMaterial.frictionStiffness = 1e7;   //Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
		this.contactMaterial.frictionRelaxation = 3;    //Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
		this.contactMaterial.surfaceVelocity = 1.0;     //Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
		
		this.contactMaterial = game.physics.p2.createContactMaterial(this.enemyMaterial, this.groundMaterial);
		this.contactMaterial.friction = 0.0;    		//Friction to use in the contact of these two materials.
		this.contactMaterial.restitution = 0.1;  		//Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
		this.contactMaterial.stiffness = 1e7;    		//Stiffness of the resulting ContactEquation that this ContactMaterial generate.
		this.contactMaterial.relaxation = 0;     		//Relaxation of the resulting ContactEquation that this ContactMaterial generate.
		this.contactMaterial.frictionStiffness = 1e7;   //Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
		this.contactMaterial.frictionRelaxation = 0;    //Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
		this.contactMaterial.surfaceVelocity = 1.0;     //Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
		
		//Collisions
		this.player.body.createBodyCallback(this.ground, this.playerCollidedGround, this);
		this.enemy.body.createBodyCallback(this.ground, this.enemyCollidedGround, this);
		this.player.body.createBodyCallback(this.enemy, this.playerCollidedEnemy, this);
		
		//Controls
		leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		enemyLeftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
		enemyRightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
		enemyJumpButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
		enemyFireButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
		
		//Text
        playerWonText = game.add.text(this.game.world.centerX, this.game.world.centerY, "SCORE", { font: "28px Chunk", fill: "#22ff22", align: "center" });
        playerWonText.anchor.setTo(0.5, 0.5);
		playerWonText.visible = false;
        enemyWonText = game.add.text(this.game.world.centerX, this.game.world.centerY, "SCORE", { font: "28px Chunk", fill: "#aa22ff", align: "center" });
        enemyWonText.anchor.setTo(0.5, 0.5);
		enemyWonText.visible = false;
		
		game.add.tween(playerWonText.scale).to({ x: 1.1, y: 1.1 }, 250).to({ x: 1, y: 1 }, 250).loop().start();
		game.add.tween(enemyWonText.scale).to({ x: 1.1, y: 1.1 }, 250).to({ x: 1, y: 1 }, 250).loop().start();
		
		//Lives
		playerLives = game.add.group();
        for (var i = 0; i < 3; i++) {
            var sprite = playerLives.create(10 + (30 * i), 10, 'life');
        }
		
		enemyLives = game.add.group();
        for (var i = 0; i < 3; i++) {
            var sprite = enemyLives.create(game.world.width - 100 + (30 * i), 10, 'life');
        }
		
		playerScored = false;
		enemyScored = false;
		
		//Volume handler
		Volume.init(0, game.world.height - 26);
		
		hailing = true;
		game.time.events.add(500, function() {
			this.playerHail.visible = true;
			this.enemyHail.visible = true;
			game.time.events.add(1000, function() {
				hailing = false;
				this.playerHail.visible = false;
				this.enemyHail.visible = false;
			}, this);
		}, this);
		
		sound_jump = game.add.audio('sound_jump');
		sound_goomba = game.add.audio('sound_goomba');
		music = game.add.audio('music');
		music.play('', 0, 0.5);
	},

	update: function () {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {            
			game.state.start('MainMenu');
        }
		
		this.updatePlayer();
		this.updateEnemy();
    },
	
	updatePlayer: function() {	
		if(!hailing) {
			if (leftButton.isDown) {
				this.player.body.moveLeft(200);
				this.player.frame = 0;
				this.doPlayerAngle();
			} else if(rightButton.isDown) {
				this.player.body.moveRight(200);
				this.player.frame = 1;
				this.doPlayerAngle();
			} else {
				this.player.body.velocity.x = 0;
				this.playerImage.angle = 0;
			}

			if (jumpButton.isDown && game.time.now > jumpTimer && !doubleJumping) {
				if(jumping) {
					doubleJumping = true;
				}
			
				sound_jump.play('', 0, 0.2);
				this.player.body.moveUp(1000);
				jumpTimer = game.time.now + 150;
				jumping = true;
			}
			
			if (fireButton.isDown && game.time.now > smashTimer) {
				this.smash();
			}
		}
		
		this.playerImage.x = this.player.x;
		this.playerImage.y = this.player.y;
		this.playerImage.frame = this.player.frame;
		this.player.scale.x = this.player.scale.x;
		this.player.scale.y = this.player.scale.y;
		this.player.visible = false;
		this.playerHail.x = this.player.x + 25;
		this.playerHail.y = this.player.y - 110;
	},
	
	updateEnemy: function() {	
		if(!hailing) {
			if (enemyLeftButton.isDown) {
				this.enemy.body.moveLeft(200);
				this.enemy.frame = 0;
				this.doEnemyAngle();
			} else if(enemyRightButton.isDown) {
				this.enemy.body.moveRight(200);
				this.enemy.frame = 1;
				this.doEnemyAngle();
			} else {
				this.enemy.body.velocity.x = 0;
				this.enemyImage.angle = 0;
			}

			if (enemyJumpButton.isDown && game.time.now > enemyJumpTimer && !enemyDoubleJumping) {
				if(enemyJumping) {
					enemyDoubleJumping = true;
				}
				
				sound_jump.play('', 0, 0.2);
				this.enemy.body.moveUp(1000);
				enemyJumpTimer = game.time.now + 150;
				enemyJumping = true;
			}
			
			if (enemyFireButton.isDown && game.time.now > enemySmashTimer) {
				this.enemySmash();
			}
		}
		
		this.enemyImage.x = this.enemy.x;
		this.enemyImage.y = this.enemy.y;
		this.enemyImage.frame = this.enemy.frame;
		this.enemyImage.scale.x = this.enemy.scale.x;
		this.enemyImage.scale.y = this.enemy.scale.y;
		this.enemy.visible = false;
		this.enemyHail.x = this.enemy.x - 120;
		this.enemyHail.y = this.enemy.y - 110;
	},
	
	doPlayerAngle: function() {
		this.playerImage.angle += playerAngleInc;
		if(playerAngleMax > 0 && this.playerImage.angle >= playerAngleMax) {
			playerAngleInc *= -1;
			playerAngleMax *= -1;
		}
		
		if(playerAngleMax < 0 && this.playerImage.angle <= playerAngleMax) {
			playerAngleInc *= -1;
			playerAngleMax *= -1;
		}
	},
	
	doEnemyAngle: function() {
		this.enemyImage.angle += enemyAngleInc;
		if(enemyAngleMax > 0 && this.enemyImage.angle >= enemyAngleMax) {
			enemyAngleInc *= -1;
			enemyAngleMax *= -1;
		}
		
		if(enemyAngleMax < 0 && this.enemyImage.angle <= enemyAngleMax) {
			enemyAngleInc *= -1;
			enemyAngleMax *= -1;
		}
	},
	
	smash: function() {
		if(!smashing && (jumping || doubleJumping)) {
			smashing = true;
			this.player.body.moveUp(1500);	
			this.game.time.events.add(400, function() {
				this.player.body.moveDown(3000);
			}, this);
		}
	},
	
	enemySmash: function() {
		if(!enemySmashing && (enemyJumping || enemyDoubleJumping)) {
			enemySmashing = true;
			this.enemy.body.moveUp(1250);	
			this.game.time.events.add(400, function() {
				this.enemy.body.moveDown(2250);
			}, this);
		}
	},
	
	playerCollidedGround: function() {
		if(jumping) {
			jumping = false;
		}
		if(doubleJumping) {
			doubleJumping = false;
		}
		if(smashing) {
			smashing = false;
		}
	},
	
	enemyCollidedGround: function() {
		if(enemyJumping) {
			enemyJumping = false;
		}
		if(enemyDoubleJumping) {
			enemyDoubleJumping = false;
		}
		if(enemySmashing) {
			enemySmashing = false;
		}
	},
	
	playerCollidedEnemy: function() {
		if(this.player.y < this.enemy.y && smashing && !playerScored) {
			playerScored = true;
			this.player.body.moveUp(1000);
			this.enemy.kill();
			this.enemyImage.kill();
			
            var live = playerLives.getAt(playerLives.countLiving() - 1);
            if (live) {
                live.kill();
				if (playerLives.countLiving() < 1) {
					playerWonText.setText('GREEN PLAYER WON');
					Fade.fadeOut('MainMenu', 2000);
				}
            }
			
			sound_goomba.play('', 0, 0.2);
			
			playerWonText.visible = true;
			game.time.events.add(2000, this.reset, this);
		}
		
		if(this.enemy.y < this.player.y && enemySmashing && !enemyScored) {
			enemyScored = true;
			this.enemy.body.moveUp(1000);
			this.player.kill();
			this.playerImage.kill();
			
            var live = enemyLives.getFirstAlive();
            if (live) {
                live.kill();
				if (enemyLives.countLiving() < 1) {
					enemyWonText.setText('PURPLE PLAYER WON');
					Fade.fadeOut('MainMenu', 2000);
				}
            }
			
			sound_goomba.play('', 0, 0.2);
			
			enemyWonText.visible = true;
			game.time.events.add(2000, this.reset, this);
		}
	},
	
	reset:function() {		
		this.player.reset(250, game.world.centerY);
		this.player.frame = 1;
		game.physics.p2.enable(this.player);
		this.player.body.fixedRotation = true;
		this.playerImage.reset(250, game.world.centerY);
		
		this.enemy.reset(game.world.width - 250, game.world.centerY);
		game.physics.p2.enable(this.enemy);
		this.enemy.body.fixedRotation = true;
		this.enemyImage.reset(game.world.width - 250, game.world.centerY);
		
		playerWonText.visible = false;
		enemyWonText.visible = false;
		
		playerScored = false;
		enemyScored = false;
		
		hailing = true;
		game.time.events.add(500, function() {
			this.playerHail.visible = true;
			this.enemyHail.visible = true;
			game.time.events.add(1000, function() {
				hailing = false;
				this.playerHail.visible = false;
				this.enemyHail.visible = false;
			}, this);
		}, this);
	}
};