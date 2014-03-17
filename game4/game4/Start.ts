module Game4 {

    export class Start extends Phaser.State {

        titleText: Phaser.Text;
        scoreText: Phaser.Text;
        introText: Phaser.Text;
        instructionsText: Phaser.Text;

        box: Phaser.Sprite;

        create() {
            this.sound.stopAll();

            //Intro
            this.titleText = this.add.text(this.world.centerX, this.world.centerY - 150, "Endless Waves of Boxes", { font: "20px Chunk", fill: "#ffffff", align: "center" });
            this.titleText.anchor.setTo(0.5, 0.5);
            this.introText = this.add.text(this.world.centerX, this.world.centerY, "Press space to start", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.introText.anchor.setTo(0.5, 0.5);
            this.add.tween(this.introText.scale).to({ x: 1.1, y: 1.1 }, 250, Phaser.Easing.Linear.None, true).to({ x: 1, y: 1 }, 250, Phaser.Easing.Linear.None, true).loop();
            this.instructionsText = this.add.text(this.world.centerX, this.world.centerY + 200, "Arrows to move; Space to shoot", { font: "12px Chunk", fill: "#ffffff", align: "center" });
            this.instructionsText.anchor.setTo(0.5, 0.5);

            this.box = this.add.sprite(-50, -50, "box");
            this.box.anchor.setTo(0.5, 0.5);

            this.time.events.loop(500, this.randomBoxes, this);
        }

        update() {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.game.state.start('Level1');
            }
        }

        randomBoxes() {
            this.box = this.add.sprite(-50, -50, "box");
            this.box.anchor.setTo(0.5, 0.5);

            var x: number = 0;
            var y: number = 0;
            var tweenX: number = 0;
            var tweenY: number = 0;

            var rnd: number = this.game.rnd.integerInRange(0, 4);
            if (rnd == 0) {
                x = this.game.rnd.integerInRange(0, this.game.width);
                y = (this.box.height / 2 + 2);
                tweenX = this.game.rnd.integerInRange(0, this.game.width);
                tweenY = this.game.height + this.box.height;
            } else if (rnd == 1) {
                x = this.game.rnd.integerInRange(0, this.game.width);
                y = (this.box.height / 2 - 2);
                tweenX = this.game.rnd.integerInRange(0, this.game.width);
                tweenY = -this.box.height;
            } else if (rnd == 2) {
                x = -(this.box.width / 2 + 2);
                y = this.game.rnd.integerInRange(0, this.game.height);
                tweenX = this.game.width + this.box.width;
                tweenY = this.game.rnd.integerInRange(0, this.game.height);
            }
            else if (rnd == 3) {
                x = this.game.width + (this.box.width / 2 - 2);
                y = this.game.rnd.integerInRange(0, this.game.height);
                tweenX = -this.box.width;
                tweenY = this.game.rnd.integerInRange(0, this.game.height);
            }

            if (x > 0 && x <= this.game.width / 2) {
                x *= -1;
            } else if (x > this.game.width / 2 && x <= this.game.width) {
                x *= 2;
            }

            if (y > 0 && y <= this.game.height / 2) {
                y *= -1;
            } else if (y > this.game.height / 2 && y <= this.game.height) {
                y *= 2;
            }

            this.box.reset(x, y);
            this.box.angle = 90 + Math.atan2(y - tweenX, x - tweenY) * 180 / Math.PI;

            var tween = this.game.add.tween(this.box).to(
                { x: tweenX, y: tweenY },
                this.game.rnd.integerInRange(1000, 4000),
                Phaser.Easing.Linear.None, true,
                this.game.rnd.integerInRange(200, 1000)
                );
            this.game.add.tween(this.box).to(
                { angle: 360 },
                this.game.rnd.integerInRange(2000, 4000),
                Phaser.Easing.Linear.None, true,
                0, true
                );
            
            tween.onComplete.add(this.dest, this);
        }

        dest() {
            this.box.kill();
        }
    }
}