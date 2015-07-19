/**
 * Created by Gytis on 2015-07-05.
 */
/// <reference path="./gameObjects/shape.ts" />
/// <reference path="../lib/kiwi.d.ts" />
/// <reference path="config.ts" />

module Tetris {
    export class Hud {
        private state: Kiwi.State;
        private score: Kiwi.GameObjects.TextField;
        private currentScore: number = 0;
        private nextShape: Shapes.Shape;
        private heldShape: Shapes.Shape;
        constructor(state: Kiwi.State, score: Kiwi.GameObjects.TextField)
        {
            this.state = state;
            this.score = score;
        }

        addScore(score: number) {
            this.currentScore += score;
            this.score.text = this.currentScore.toString();
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
