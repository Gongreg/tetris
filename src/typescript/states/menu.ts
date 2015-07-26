/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../lib/kiwi.d.ts" />
/// <reference path="../config.ts" />

module Tetris {

    export class MenuState extends Kiwi.State
    {

        update()
        {
            if (this.game.input.mouse.isDown) {
                this.game.states.switchState('main');
            }
        }

        create()
        {
            super.create();

            this.addChild(new Kiwi.GameObjects.TextField(this, "Tetris clone", Config.boardWidthInPixels / 2, 200, "#000", 30));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Default controls for the game are:", Config.boardWidthInPixels / 2, 250, "#000", 20));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Move - arrow keys", Config.boardWidthInPixels / 2, 280, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Rotate counterclockwise - z", Config.boardWidthInPixels / 2, 300, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Rotate clockwise - x", Config.boardWidthInPixels / 2, 320, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Rotate both ways - up arrow", Config.boardWidthInPixels / 2, 340, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Soft drop - down key", Config.boardWidthInPixels / 2, 360, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Hard drop - space", Config.boardWidthInPixels / 2, 380, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "Hold - shift", Config.boardWidthInPixels / 2, 400, "#000", 16));
            this.addChild(new Kiwi.GameObjects.TextField(this, "On mobile you can also play", Config.boardWidthInPixels / 2, 440, "#000", 20));
            this.addChild(new Kiwi.GameObjects.TextField(this, "with on screen buttons", Config.boardWidthInPixels / 2, 460, "#000", 20));

            this.addChild(new Kiwi.GameObjects.TextField(this, "Click on screen to play", Config.boardWidthInPixels / 2, 490, "#000", 25));

            this.getAllChildren().forEach((children: Kiwi.GameObjects.TextField) => children.textAlign = 'center');

        }
    }

}