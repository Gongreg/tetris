/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../config.ts" />

module Tetris {

    export class GameOverState extends Kiwi.State
    {

        update()
        {
            if (this.game.input.mouse.isDown) {
                this.game.states.switchState('main');
            }
        }

        create(score, level, lines)
        {
            super.create();

            this.addChild(new Kiwi.GameObjects.TextField(this, "Game Over!", Config.boardWidthInPixels / 2, 100, "#000", 30));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Score", Config.boardWidthInPixels / 2, 150, "#000", 24));
            this.addChild(new Kiwi.GameObjects.TextField(this, score.toString(), Config.boardWidthInPixels / 2, 175, "#000", 24));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Lines", Config.boardWidthInPixels / 2, 200, "#000", 24));
            this.addChild(new Kiwi.GameObjects.TextField(this, lines.toString(), Config.boardWidthInPixels / 2, 225, "#000", 24));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Level", Config.boardWidthInPixels / 2, 250, "#000", 24));
            this.addChild(new Kiwi.GameObjects.TextField(this, level.toString(), Config.boardWidthInPixels / 2, 275, "#000", 24));

            this.addChild(new Kiwi.GameObjects.TextField(this, 'Play again', Config.boardWidthInPixels / 2, 350, "#000", 24));

            this.getAllChildren().forEach((children: Kiwi.GameObjects.TextField) => children.textAlign = 'center');

        }
    }

}