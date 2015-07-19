/**
 * Created by Gytis on 2015-07-05.
 */
/// <reference path="./game-objects/shapes/shape.ts" />
/// <reference path="../lib/kiwi.d.ts" />
/// <reference path="config.ts" />
/// <reference path="scoring-manager.ts" />

module Tetris {
    export class Hud {
        private scoringManager: ScoringManager;
        private state: Kiwi.State;
        private scoreObject: Kiwi.GameObjects.TextField;
        private levelObject: Kiwi.GameObjects.TextField;

        private nextShape: Shapes.Shape;
        private heldShape: Shapes.Shape;

        constructor(state: Kiwi.State, scoringManager: ScoringManager, level: Kiwi.GameObjects.TextField,  score: Kiwi.GameObjects.TextField)
        {
            this.state = state;
            this.levelObject = level;
            this.scoreObject = score;
            this.scoringManager = scoringManager;
        }


        updateScore()
        {
            var info = this.scoringManager.getInfo();
            this.scoreObject.text = info.score.toString();
            this.levelObject.text = info.level.toString();
        }

        static setUpSprite(shape: Shapes.Shape, shapeName, marginX, marginY) {

            var gameObject = shape.getGameObject();

            if (shapeName == 'ShapeI') {
                shape.rotate().rotate();
                marginX -= 20;
                marginY -= 15;
            }


            if (shapeName == 'ShapeO') {
                marginX -= 10;
                marginY += 4;
            }

            gameObject.y = marginY;
            gameObject.x = marginX;
            gameObject.scale = 0.7;

            return gameObject;
        }

        setNextShape(shapeName: string) {

            console.log('called');

            if (this.nextShape) {
                this.nextShape.getGameObject().destroy();
            }

            this.nextShape = new Shapes[shapeName](this.state, 0, 0);

            if (shapeName == 'ShapeI') {
                this.nextShape.rotate();
                this.nextShape.rotate();
            }

            this.state.addChild(
                Hud.setUpSprite(
                    this.nextShape,
                    shapeName,
                    Config.boardWidthInPixels - 6,
                    235
                )
            );
        }

        setHeldShape(shapeName: string) {
            if (this.heldShape) {
                this.heldShape.getGameObject().destroy();
            }

            this.heldShape = new Shapes[shapeName](this.state, 0, 0);

            if (shapeName == 'ShapeI') {
                this.heldShape.rotate();
                this.heldShape.rotate();
            }

            this.state.addChild(
                Hud.setUpSprite(
                    this.heldShape,
                    shapeName,
                    Config.boardWidthInPixels - 6,
                    415
                )
            );
        }
    }
}
