Game10.MainMenu = function (game) {
    this.game = game;
};

Game10.MainMenu.prototype = {
	create: function () {
        this.sound.stopAll();

        this.welcome = this.addTextElement("Drop Something!");
        this.scorefont = this.addTextElement("Highscore: " + this.game.highscore);
        this.pressSpace = this.addTextElement("Press Space to play!");

        this.highscore = this.game.add.image(this.game.world.centerX, this.game.world.centerY - 50, this.scorefont);
        this.highscore.anchor.setTo(0.5, 0.5);

        this.titleText = this.game.add.image(this.game.world.centerX, this.game.world.centerY, this.welcome);
        this.titleText.anchor.setTo(0.5, 0.5);

        this.pressSpace = this.game.add.image(this.game.world.centerX, this.game.world.centerY + 50, this.pressSpace);
        this.pressSpace.anchor.setTo(0.5, 0.5);
	},

    addTextElement: function (endTextValue) {
        var newText = this.game.add.retroFont('font', 8, 8, '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ:!?');
        newText.text = endTextValue;
        return newText;
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
