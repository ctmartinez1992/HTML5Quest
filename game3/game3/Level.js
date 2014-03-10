var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Game3;
(function (Game3) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            _super.apply(this, arguments);
        }
        Level.prototype.create = function () {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Game3.Volume(this.game, 5, this.world.height - 30);

            //Scores and lives
            this.lives = this.add.group();
            this.playerLives = this.add.text(this.game.world.width - 100, 10, 'Lives ', { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.playerScore = this.add.text(10, 10, "Score " + Level.SCORE, { font: "20px Chunk", fill: "#ffffff", align: "center" });
            for (var i = 0; i < 3; i++) {
                var sprite = this.lives.create(this.game.world.width - 100 + (30 * i), 60, 'ship');
                sprite.anchor.setTo(0.5, 0.5);
                sprite.alpha = 0.75;
            }

            //Sound
            this.music = this.add.audio('asteroid_march', 1.0, true);
            this.music.play('', 0, 0.5, true);

            //Player
            this.player = new Game3.Player(this.game, this.world.centerX, this.world.height - 50);

            //Booleans
            Level.doIntro = true;
            Level.doUpdate = false;

            //Counters
            Level.PLAYER_SPEED = 5;
            Level.DIFFICULTY = 0;
            Level.SCORE = 0;

            //Intro
            this.titleText = this.add.text(this.world.centerX, this.world.centerY - 225, "Asteroid Field", { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.titleText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.titleText.position).to({ y: this.world.centerY - 250 }, 250, Phaser.Easing.Elastic.In, true).to({ y: this.world.centerY - 200 }, 250, Phaser.Easing.Exponential.Out, true).loop();
            this.introText = this.add.text(this.world.centerX, this.world.centerY - 50, "Press space to start", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
            this.instructionsText = this.add.text(this.world.centerX, this.world.centerY + 200, "Arrows to move; Avoid asteroids", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.instructionsText.anchor.setTo(0.5, 0.5);
        };

        Level.prototype.update = function () {
            //Do the intro
            if (Level.doIntro) {
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = 0;
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                    //Get ready to start game
                    Level.doIntro = false;
                    Level.doUpdate = true;
                    this.titleText.visible = false;
                    this.introText.visible = false;
                    this.instructionsText.visible = false;
                }
            }

            //Update the game
            if (Level.doUpdate) {
                //Update the player
                this.player.updatePlayer();

                //Update score
                this.playerScore.content = "Score " + Level.SCORE;

                //Decrease player speed based on score
                if (Level.SCORE % 10 == 0) {
                    Level.PLAYER_SPEED -= 0.2;
                    if (Level.PLAYER_SPEED <= 2) {
                        Level.PLAYER_SPEED = 2;
                    }
                }
            }
        };
        Level.PLAYER_SPEED = 5;
        Level.DIFFICULTY = 0;
        Level.SCORE = 0;
        return Level;
    })(Phaser.State);
    Game3.Level = Level;
})(Game3 || (Game3 = {}));
//# sourceMappingURL=Level.js.map
