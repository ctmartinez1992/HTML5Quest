module Game4 {
    export class Game extends Phaser.Game {

        constructor() {
            super(480, 480, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('Start', Start, false);
            this.state.add('Level1', Level1, false);
            this.state.add('Victory', Victory, false);

            this.state.start('Boot');
        }
    }
}