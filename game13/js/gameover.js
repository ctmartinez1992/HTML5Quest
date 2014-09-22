Game13.GameOver = function (game) {
    this.game = game;
};

Game13.GameOver.prototype = {
	create: function () {
        this.sound.stopAll();
		
		//Background
		game.stage.backgroundColor = 0x000000;
		
        this.textTitle = game.add.text(game.camera.width / 2, 50, "Game Over", { font: "24px Chunk", fill: "#ffffff", align: "center" });
        this.textTitle.anchor.setTo(0.5, 0.5);
		this.textTitle.alpha = 0;
		this.textTitle.fixedToCamera = true;
		game.add.tween(this.textTitle).to({ alpha: 1 }, 1000).start();
		
		if(this.game.score > this.game.highscore) {		
			this.game.highscore = this.game.score;
			this.textHigh = game.add.text(game.camera.width / 2, 150, "", { font: "40px Chunk", fill: "#ff2211", align: "center" });
			this.textHigh.anchor.setTo(0.5, 0.5);
			this.textHigh.alpha = 0;
			this.textHigh.fixedToCamera = true;
			game.add.tween(this.textHigh).to({ alpha: 1 }, 1000, null, false, 1000).start();
			game.add.tween(this.textHigh.scale).to({ x: 1.1, y: 1.1 }, 250).to({ x: 1, y: 1 }, 250).loop().start();
		}
		
        this.textInst = game.add.text(game.camera.width / 2, game.camera.height / 2 + 50, "SCORE: " + Game13.score, { font: "18px Chunk", fill: "#ffffff", align: "center" });
        this.textInst.anchor.setTo(0.5, 0.5);
		this.textInst.alpha = 0;
		this.textInst.fixedToCamera = true;
		game.add.tween(this.textInst).to({ alpha: 1 }, 500, null, false, 1500).start();
		
        this.text = game.add.text(game.camera.width / 2, game.camera.height - 50, "SPACE TO GO TO MENU", { font: "18px Chunk", fill: "#ffffff", align: "center" });
        this.text.anchor.setTo(0.5, 0.5);
		this.text.alpha = 0;
		this.text.fixedToCamera = true;
		game.add.tween(this.text).to({ alpha: 1 }, 500, null, false, 1500).start();
		game.add.tween(this.text).to({ angle: -1 }, 250).to({ angle: 1 }, 250).loop().start();	
	},

	update: function () {	
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.startGame();
        }
	},

	startGame: function () {
		Fade.fadeOut('MainMenu');
	}
};
