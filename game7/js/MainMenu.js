Game7.MainMenu = function (game) {
    this.game = game;
};

var logo_hail;
var logo_jump;
var logo_smash;

Game7.MainMenu.prototype = {
	create: function () {
        this.sound.stopAll();
		
		//Logo intro
		logo_hail = game.add.sprite(this.game.world.centerX - 270, 100, 'logo_hail');
        logo_hail.anchor.setTo(0.5, 0.5);
		logo_hail.alpha = 0;
		game.add.tween(logo_hail).delay(500).to({ alpha: 1 }, 500).start();
		var tween_hail = game.add.tween(logo_hail.scale).delay(500).to({ x: 1.5, y: 1.5 }, 500).start();
		tween_hail.onComplete.add(
			function() {
				game.add.tween(logo_hail.scale).to({ x: 1, y: 1 }, 1000).start();
			}
		, this);
		
		logo_jump = game.add.sprite(this.game.world.centerX - 25, 1000, 'logo_jump');
        logo_jump.anchor.setTo(0.5, 0.5);
		var tween_jump = game.add.tween(logo_jump).delay(2000).to({ y: 50 }, 1000, Phaser.Easing.Bounce.Out).start();
		tween_jump.onComplete.add(
			function() {
				game.add.tween(logo_jump).to({ y: 100 }, 500).start();
			}
		, this);
		
		logo_smash = game.add.sprite(this.game.world.centerX + 250, -1000, 'logo_smash');
        logo_smash.anchor.setTo(0.5, 0.5);
		var tween_smash = game.add.tween(logo_smash).delay(3500).to({ y: 100 }, 750, Phaser.Easing.Bounce.Out).start();
		tween_smash.onComplete.add(this.showText, this);
	},

	update: function () {	
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.startGame();
        }
	},

	showText: function () {
		//Logo animation
		game.add.tween(logo_hail.scale).to({ x: 1.1, y: 1.1 }, 250).to({ x: 1, y: 1 }, 250).loop().start();
		game.add.tween(logo_jump).to({ y: 80 }, 250).to({ y: 100 }, 250).loop().start();
		game.add.tween(logo_smash).delay(250).to({ y: 20 }, 2000).to({ y: 100 }, 250).loop().start();
	
		//Menu text
        this.text = game.add.text(this.game.world.width / 2, this.game.world.height / 2 + 50, "SPACE TO START", { font: "18px Chunk", fill: "#ffffff", align: "center" });
        this.text.anchor.setTo(0.5, 0.5);
		this.text.alpha = 0;
		game.add.tween(this.text).to({ alpha: 1 }, 500).start();
		game.add.tween(this.text).to({ angle: -1 }, 250).to({ angle: 1 }, 250).loop().start();
		
        this.textInst = game.add.text(this.game.world.width / 2, this.game.world.height / 2 + 150, "GREEN PLAYER: Left/Right to move; Up to jump; Down to smash", { font: "12px Chunk", fill: "#22ff22", align: "center" });
        this.textInst.anchor.setTo(0.5, 0.5);
		this.textInst.alpha = 0;
		game.add.tween(this.textInst).delay(250).to({ alpha: 1 }, 500).start();
		
        this.textInstEnemy = game.add.text(this.game.world.width / 2, this.game.world.height / 2 + 200, "PURPLE PLAYER: A/D to move; W to jump; S to smash", { font: "12px Chunk", fill: "#aa22ff", align: "center" });
        this.textInstEnemy.anchor.setTo(0.5, 0.5);
		this.textInstEnemy.alpha = 0;
		game.add.tween(this.textInstEnemy).delay(250).to({ alpha: 1 }, 500).start();
		
        this.textObjs = game.add.text(this.game.world.width / 2, this.game.world.height / 2 + 250, "JUMP AND THEN SMASH THE PLAYER ON THE HEAD", { font: "12px Chunk", fill: "#aa2222", align: "center" });
        this.textObjs.anchor.setTo(0.5, 0.5);
		this.textObjs.alpha = 0;
		game.add.tween(this.textObjs).delay(500).to({ alpha: 1 }, 500).start();
	},

	startGame: function () {
		Fade.fadeOut('Game');
	}
};
