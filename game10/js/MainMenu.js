Game10.MainMenu = function (game) {
    this.game = game;
    this.game.highscore = 0;
};

Game10.MainMenu.prototype = {
	create: function () {
        this.sound.stopAll();
		
        this.textTitle = game.add.text(game.camera.width / 2, -50, "PERPETUAL FALL", { font: "28px Chunk", fill: "#ffffff", align: "center" });
        this.textTitle.anchor.setTo(0.5, 0.5);
		this.textTitle.alpha = 1;
		game.add.tween(this.textTitle).to( { y: 700 }, 10000, null, true, 1000, 10000);
		
        this.textInst = game.add.text(game.camera.width / 2, game.camera.height / 2 - 60, "LAND ONTO THE PLATFORMS", { font: "16px Chunk", fill: "#ffffff", align: "center" });
        this.textInst.anchor.setTo(0.5, 0.5);
		this.textInst.alpha = 0;
		this.textInst.fixedToCamera = true;
		game.add.tween(this.textInst).to({ alpha: 1 }, 500, null, false, 1000).start();
		
        this.textInst2 = game.add.text(game.camera.width / 2, game.camera.height / 2, "CATCH OR AVOID STUFF", { font: "16px Chunk", fill: "#ffffff", align: "center" });
        this.textInst2.anchor.setTo(0.5, 0.5);
		this.textInst2.alpha = 0;
		this.textInst2.fixedToCamera = true;
		game.add.tween(this.textInst2).to({ alpha: 1 }, 500, null, false, 1500).start();
		
        this.textInst3 = game.add.text(game.camera.width / 2, game.camera.height / 2 + 60, "DONT LEAVE THE SCREEN", { font: "16px Chunk", fill: "#ff3618", align: "center" });
        this.textInst3.anchor.setTo(0.5, 0.5);
		this.textInst3.alpha = 0;
		game.add.tween(this.textInst3).to({ alpha: 1 }, 500, null, false, 2000).start();
		
        this.textObj = game.add.text(game.camera.width / 2, game.camera.height / 2 + 125, "", { font: "18px Chunk", fill: "#ff69b4", align: "center" });
        this.textObj.anchor.setTo(0.5, 0.5);
		this.textObj.alpha = 0;
		this.textObj.fixedToCamera = true;
		game.add.tween(this.textObj).to({ alpha: 1 }, 500, null, false, 2500).start();
		game.add.tween(this.textObj.scale).to({ x: 1.1, y: 1.1 }, 250).to({ x: 1, y: 1 }, 250).loop().start();	
		
        this.text = game.add.text(game.camera.width / 2, game.camera.height - 50, "LEFT OR RIGHT TO START", { font: "18px Chunk", fill: "#ffffff", align: "center" });
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
		var x = x || 5;
		var y = y || 5;
		var rx = Math.floor(Math.random() * (x + 2.5)) - x / 2;
		var ry = Math.floor(Math.random() * (y + 2.5)) - y / 2;
		rx = (rx === 0 && x !== 0) ? ((Math.random() < 0.5) ? 1.5 : -1.5) : rx;
		ry = (ry === 0 && y !== 0) ? ((Math.random() < 0.5) ? 1.5 : -1.5) : ry;
		this.textInst3.x += rx - 3;
		this.textInst3.y += ry;
		if((this.textInst3.x > game.camera.width / 2 + 15) || this.textInst3.x < (game.camera.width / 2 - 15)) {
			this.textInst3.x = game.camera.width / 2;
		}
		if((this.textInst3.y > game.camera.height / 2 + 60 + 15) || this.textInst3.y < (game.camera.height / 2 + 60 - 15)) {
			this.textInst3.y = game.camera.height / 2 + 60;
		}
		
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.startGame();
        }
	},

	startGame: function () {
		Fade.fadeOut('Game');
	}
};
