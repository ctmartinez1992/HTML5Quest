Game5.MainMenu = function (game) {
    this.game = game;
};

Game5.MainMenu.prototype = {
	create: function () {
        this.logo = game.add.text(this.game.world.width / 2, 75, "Flappy Tube", { font: "25px Chunk", fill: "#000000", align: "center" });
        this.logo.anchor.setTo(0.5, 0.5);
		this.y = -200;
		game.add.tween(this.logo).delay(250).to({ y: 75 }, 750, Phaser.Easing.Bounce.Out).start();
		game.add.tween(this.logo).to({ angle: 1 }, 500).to({ angle: -1 }, 500).loop().start();
		
        this.text = game.add.text(this.game.world.width / 2, this.game.world.height / 2 + 15, "Press space to play", { font: "18px Chunk", fill: "#000000", align: "center" });
        this.text.anchor.setTo(0.5, 0.5);
		this.text.alpha = 0;
		game.add.tween(this.text).delay(500).to({ alpha: 1 }, 500).start();
		game.add.tween(this.text.scale).to({ x: 1.1, y: 1.1 }, 500).to({ x: 1, y: 1 }, 500).loop().start();
		
        this.instructions = game.add.text(this.game.world.width / 2, this.game.world.height / 2 + 150, "Be a tube; Space to jump", { font: "12px Chunk", fill: "#000000", align: "center" });
        this.instructions.anchor.setTo(0.5, 0.5);
		this.instructions.y = game.world.height + 100;
		game.add.tween(this.instructions).delay(500).to({ y: this.game.world.height / 2 + 150 }, 500).start();
		
        this.text = game.add.text(this.game.world.width - 100, 10, "Highscore: " + this.game.highscore, { font: "16px Chunk", fill: "#000000", align: "center" });
        this.text.anchor.setTo(0.5, 0.5);

        this.keylocked = true;
		
		this.explosion = game.add.audio('explosion', 0.5);
		this.explosion.play();
	},

	update: function () {
        if(!this.keylocked && (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.pointer1.isDown)) {
            this.startGame();
        }

        if (this.game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR, 3000) || this.game.input.pointer1.isUp) {
            this.keylocked = false;
        }
	},

	startGame: function () {
		this.game.state.start('Game');
	}
};
