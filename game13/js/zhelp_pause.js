function Pause() { }

//Pause button and text
var pauseButton;
var pauseText;

//Game music and pause music
var music;
var pauseMusic;

Pause.init = function() {
	//Initialize pause button and text
    pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
    pauseButton.onDown.add(this.pauseGame, this);
    pauseText = game.add.text(game.camera.width / 2, game.camera.height / 2, "PAUSED", { font: "64px Chunk", fill: "#ffffff", align: "center" });
	pauseText.fixedToCamera = true;
    pauseText.anchor.setTo(0.5, 0.5);
    pauseText.visible = false;
		
	//Add music
	if (!music) {
		music = game.add.audio('music');
	}
	if (!pauseMusic) {
		pauseMusic = game.add.audio('pause_music');
	}
	if (!music.isPlaying) {
		music.play('', 0, 0.15, true);
	}
	if (!pauseMusic.isPlaying) {
		pauseMusic.play('', 0, 0.25, true);
		pauseMusic.pause();
	}
};

Pause.pauseGame = function() {
    doUpdate = !doUpdate;
	pauseText.visible = doUpdate;
	if (pauseText.visible) {
		game.sound.pauseAll();
		pauseMusic.resume();
    } else {
		game.sound.pauseAll();
		music.resume();
	}
};