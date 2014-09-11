Game12.MainMenu = function (game) {
    this.game = game;
    this.game.highscore = 0;
};

Game12.MainMenu.prototype = {
	create: function () {
        this.sound.stopAll();
		
        this.textTitle = game.add.text(game.camera.width / 2, game.camera.height / 2 - 200, "8PHONE", { font: "28px Chunk", fill: "#ffffff", align: "center" });
        this.textTitle.anchor.setTo(0.5, 0.5);
		this.textTitle.alpha = 1;
		
        this.textInst = game.add.text(game.camera.width / 2, game.camera.height / 2 - 60, "CLICK TO SMITE - NUMBERS TO CHANGE", { font: "16px Chunk", fill: "#ffffff", align: "center" });
        this.textInst.anchor.setTo(0.5, 0.5);
		this.textInst.alpha = 0;
		this.textInst.fixedToCamera = true;
		game.add.tween(this.textInst).to({ alpha: 1 }, 500, null, false, 1000).start();
		
        this.textInst2 = game.add.text(game.camera.width / 2, game.camera.height / 2, "OBJECTIVE 1", { font: "16px Chunk", fill: "#ffffff", align: "center" });
        this.textInst2.anchor.setTo(0.5, 0.5);
		this.textInst2.alpha = 0;
		this.textInst2.fixedToCamera = true;
		game.add.tween(this.textInst2).to({ alpha: 1 }, 500, null, false, 1500).start();
		
        this.textInst3 = game.add.text(game.camera.width / 2, game.camera.height / 2 + 60, "OBJECTIVE 2", { font: "24px Chunk", fill: "#ff3618", align: "center" });
        this.textInst3.anchor.setTo(0.5, 0.5);
		this.textInst3.alpha = 0;
		game.add.tween(this.textInst3).to({ alpha: 1 }, 500, null, false, 2000).start();
		
        this.text = game.add.text(game.camera.width / 2, game.camera.height - 50, "SPACE TO START", { font: "18px Chunk", fill: "#ffffff", align: "center" });
        this.text.anchor.setTo(0.5, 0.5);
		this.text.alpha = 0;
		this.text.fixedToCamera = true;
		game.add.tween(this.text).to({ alpha: 1 }, 500, null, false, 2500).start();
		game.add.tween(this.text).to({ angle: -1 }, 250).to({ angle: 1 }, 250).loop().start();
	},
	
	onStart: function () {
		tween.delay(0);
	},

	onLoop: function () {
	
	},

	onComplete: function () {
	},

	update: function () {
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.startGame();
        }
	},

	startGame: function () {
		Fade.fadeOut('Game');
	}
};
