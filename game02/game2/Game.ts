module Game2 {
    export class Game extends Phaser.Game {

        constructor() {
            super(500, 700, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('Level', Level, false);
            this.state.add('GameOver', GameOver, false);

            this.state.start('Boot');
        }
    }
}