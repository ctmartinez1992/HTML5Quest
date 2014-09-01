Game5.Game = function (game) {
    this.game = game;
    this.game.score = 0;
    this.game.highscore = 0;
};

Game5.Game.prototype = {
	create: function () {
        this.game.stage.backgroundColor = '#AFD8FA';

        this.tubes = this.game.add.group();
		
        this.tube = new Tube('2', this.game, this.tubes);
        this.birds = [];
        this.birds.push(new Bird('bird1', this.game));
        this.birds.push(new Bird('bird2', this.game, this.game.world.width + 75 + this.game.world.width/2));
        this.key = false;
        this.game.score = 0;

        this.text = game.add.text(this.game.world.width - 60, 10, "Score: 0", { font: "16px Chunk", fill: "#000000", align: "center" });
        this.text.anchor.setTo(0.5, 0.5);
		
        this.land = this.game.add.tileSprite(0, this.game.world.height-48, this.game.world.width, 48, 'ground');
    },

	update: function () {
        if (!this.key && (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.pointer1.isDown)) {
            this.key = true;
            this.tube.up(-250);
        }

        if (this.game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR, 25) || this.game.input.pointer1.isUp) {
            this.key = false;
        }

        this.tube.update();
        for(var i = 0, len = this.birds.length; i < len; i++) {
            this.birds[i].update();
            this.game.physics.overlap(this.birds[i].getSprite(), this.tube.getGroup(), this.collisionHandler, null, this);
        }

        if (!this.tube.isAlive) {
            this.quitGame();
        }

        this.land.tilePosition.x += this.birds[0].getSprite().body.velocity.x / 100;
        this.text.setText("Score: " + this.game.score);
    },

    collisionHandler: function() {
        this.quitGame();
    },

	quitGame: function (pointer) {
		this.game.state.start('MainMenu');
	}
};
