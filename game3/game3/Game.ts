module Game3 {
    export class Game extends Phaser.Game {

        constructor() {
            super(800, 600, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('Start', Start, false);
            this.state.add('Level1', Level1, false);
            this.state.add('Level2', Level2, false);
            this.state.add('Level3', Level3, false);
            this.state.add('Level4', Level4, false);
            this.state.add('Level5', Level5, false);
            this.state.add('Level6', Level6, false);
            this.state.add('Level7', Level7, false);
            this.state.add('Level8', Level8, false);
            this.state.add('Level9', Level9, false);
            this.state.add('Level10', Level10, false);
            this.state.add('LevelRandom', LevelRandom, false);
            this.state.add('Victory', Victory, false);

            this.state.start('Boot');
        }
    }
}