Game15.Game = function (game) {
    this.game = game;
};
	
	var SHOT_DELAY = 300;		//Bullet shot delay
    var BULLET_SPEED = 800;		//Bullet speed
    var NUMBER_OF_BULLETS = 20;	//Available bullets
    var GRAVITY = 980;			//Bullet gravity

Game15.Game.prototype = {
	create: function () {
		//Necessary stuff
        this.sound.stopAll();
		
		//juicy juicy
		this.juicy = this.game.plugins.add(new Phaser.Plugin.Juicy(this));
		
		this.game.stage.backgroundColor = 0x333333;
		
		//Control variables
		doUpdate = true;
		paused = false;
		this.dead = false;
		
		//Arcade physics
		this.game.physics.arcade.gravity.y = GRAVITY;
		
		//Capture certain keys to prevent their default actions in the browser.
		//This is only necessary because this is an HTML5 game. Games on other platforms may not need code like this.
		this.game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN,
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.SPACE
		]);
		
		//Create an object representing our gun
		this.gun = this.game.add.sprite(50, this.game.height - 64, 'player');
		this.gun.anchor.setTo(0.5, 0.5);

		//Create an object pool of bullets
		this.bulletPool = this.game.add.group();
		for(var i = 0; i < NUMBER_OF_BULLETS; i++) {
			var bullet = this.game.add.sprite(0, 0, 'bullet');
			this.bulletPool.add(bullet);
			bullet.anchor.setTo(0.5, 0.5);
			this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
			bullet.kill();
		}

		//Create some ground
		this.ground = this.game.add.group();
		for(var x = 0; x < this.game.width; x += 32) {
			var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
			this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
			groundBlock.body.immovable = true;
			groundBlock.body.allowGravity = false;
			this.ground.add(groundBlock);
		}

		//Create explosions
		this.explosionGroup = this.game.add.group();

		//The trajectory on the screen
		this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
		this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
		this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
		this.game.add.image(0, 0, this.bitmap);

		//Simulate a pointer click/tap input
		this.game.input.activePointer.x = this.game.width / 2;
		this.game.input.activePointer.y = this.game.height / 2 - 100;

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
				if (this.checkAlive()) {
					this.quitGame();
				}
				
				//Check if won
				if (this.checkWin()) {
					this.winGame();
				}
				
				//Draw the trajectory every frame
				this.drawTrajectory();

				//Check if bullets have collided with the ground
				this.game.physics.arcade.collide(this.bulletPool, this.ground, function(bullet, ground) {
					this.getExplosion(bullet.x, bullet.y);
					bullet.kill();
				}, null, this);

				//Rotate all living bullets to match their trajectory
				this.bulletPool.forEachAlive(function(bullet) {
					bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
				}, this);

				//Update the player
				this.updatePlayer();
				
				//Set score
				this.textScore.text = "SCORE: " + this.game.score;
			} else {
				
			}
        }		
    },
	
	updatePlayer: function() {
		this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun);
		if (this.game.input.activePointer.isDown) {
			this.shootBullet();
		}
	},
	
	checkAlive: function() {
		return false;
    },

	quitGame: function () {
		//Game Over. Go to GameOver Screen
        if (!this.dead) {
            this.dead = true;
			//this.loseSound.play('', 0, 0.5);
			Fade.fadeOut('GameOver');
        }
	},
	
	checkWin: function() {
		return false;
    },

	winGame: function () {
		//Game Won. Go to GameWin Screen
        if (!this.dead) {
            this.dead = true;
			//this.winSound.play('', 0, 0.5);
			Fade.fadeOut('GameWin');
        }
	},
	
	drawTrajectory: function () {
		this.bitmap.context.clearRect(0, 0, this.game.width, this.game.height);
		this.bitmap.context.fillStyle = 'rgba(255, 255, 255, 0.5)';

		var correctionFactor = 0.99;
		var MARCH_SPEED = 40;
		this.timeOffset = this.timeOffset + 1 || 0;
		this.timeOffset = this.timeOffset % MARCH_SPEED;

		var theta = -this.gun.rotation;
		var x = 0;
		var y = 0;
		for(var t = 0 + this.timeOffset / (1000 * MARCH_SPEED / 60); t < 3; t += 0.03) {
			x = BULLET_SPEED * t * Math.cos(theta) * correctionFactor;
			y = BULLET_SPEED * t * Math.sin(theta) * correctionFactor - 0.5 * GRAVITY * t * t;
			this.bitmap.context.fillRect(x + this.gun.x, this.gun.y - y, 3, 3);
			if (y < -15) {
				break;
			}
		}

		this.bitmap.dirty = true;
	},
	
	shootBullet: function() {
		if (this.game.time.now - this.lastBulletShotAt < SHOT_DELAY) {
			return;
		}
		if (this.lastBulletShotAt === undefined) {
			this.lastBulletShotAt = 0;
		}
		
		this.lastBulletShotAt = this.game.time.now;

		//Get a dead bullet from the pool
		var bullet = this.bulletPool.getFirstDead();
		if (bullet === null || bullet === undefined) {
			return;
		}

		bullet.revive();
		bullet.checkWorldBounds = true;
		bullet.outOfBoundsKill = true;
		bullet.reset(this.gun.x, this.gun.y);
		bullet.rotation = this.gun.rotation;
		bullet.body.velocity.x = Math.cos(bullet.rotation) * BULLET_SPEED;
		bullet.body.velocity.y = Math.sin(bullet.rotation) * BULLET_SPEED;
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
	}
};