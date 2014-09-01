module Game2 {

    export class Level extends Phaser.State {

        static PLAYER_SPEED: number = 5;
        static DIFFICULTY: number = 0;
        static SCORE: number = 0;
        
        music: Phaser.Sound;

        playerScore: Phaser.Text;
        titleText: Phaser.Text;
        introText: Phaser.Text;
        instructionsText: Phaser.Text;

        asteroidSpawn: Phaser.TimerEvent;

        player: Game2.Player;
        volume: Game2.Volume;
        asteroidManager: Game2.AsteroidManager;
        
        static doIntro: boolean
        static doUpdate: boolean;

        create() {
            this.sound.stopAll();

            //Volume icon
            this.volume = new Volume(this.game, 5, this.world.height - 30);

            //Scores
            this.playerScore = this.add.text(10, 10, "Score " + Level.SCORE, { font: "20px Chunk", fill: "#ffffff", align: "center" });
            
            //Sound
            this.music = this.add.audio('asteroid_march', 1.0, true);
            this.music.play('', 0, 0.5, true);

            //Player, enemy and the ball
            this.player = new Player(this.game, this.world.centerX, this.world.height - 50);

            //Asteroids group
            this.asteroidManager = new AsteroidManager(this.game);

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
        }

        update() {
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

                    //Generate new asteroids
                    this.asteroidSpawn = this.time.events.loop(300 - (250 * (Level.DIFFICULTY - Level.DIFFICULTY)), this.generateNewAsteroid, this);
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
                    if(Level.PLAYER_SPEED <= 2) {
                        Level.PLAYER_SPEED = 2;
                    }
                }

                //Asteroid collision with player
                this.asteroidManager.updateAsteroidCollision(this.player, this);
            }
        }

        generateNewAsteroid() {
            this.asteroidManager.addRandomAsteroid();
        }
    }
}