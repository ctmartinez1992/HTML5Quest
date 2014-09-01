module Game1 {
    export class Game extends Phaser.Game {

        constructor() {
            super(800, 600, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('PlayMenu', PlayMenu, false);
            this.state.add('LevelEasy', LevelEasy, false);
            this.state.add('LevelNormal', LevelNormal, false);
            this.state.add('LevelHard', LevelHard, false);
            this.state.add('LevelImpossible', LevelImpossible, false);

            this.state.start('Boot');
        }
    }
}