/**
 * Created by Gytis on 2015-07-05.
 */
/// <reference path="game-objects/shapes/shape.ts" />
/// <reference path="lib/kiwi.d.ts" />
/// <reference path="config.ts" />
/// <reference path="scoring-manager.ts" />

module Tetris {
    export class Hud {
        private scoringManager: ScoringManager;
        private state: Kiwi.State;
        private scoreObject: Kiwi.GameObjects.TextField;
        private levelObject: Kiwi.GameObjects.TextField;
        private linesObject: Kiwi.GameObjects.TextField;

        private nextShape: Shapes.Shape;
        private heldShape: Shapes.Shape;

        constructor(state: Kiwi.State, scoringManager: ScoringManager, level: Kiwi.GameObjects.TextField,  score: Kiwi.GameObjects.TextField, lines: Kiwi.GameObjects.TextField)
        {
            this.state = state;
            this.levelObject = level;
            this.scoreObject = score;
            this.linesObject = lines;
            this.scoringManager = scoringManager;
        }


        updateScore()
        {
            var info = this.scoringManager.getInfo();
            this.scoreObject.text = info.score.toString();
            this.levelObject.text = info.level.toString();
            this.linesObject.text = info.lines.toString();
        }

        static setUpSprite(shape: Shapes.Shape, shapeName: string, marginX: number, marginY: number) {

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
            gameObject.getAllChildren().forEach((sprite: Kiwi.GameObjects.Sprite) => {
                sprite.alpha = 0;
                var tween = sprite.state.game.tweens.create(sprite);
                tween.to({alpha: 1}, Config.animationTime, Kiwi.Animations.Tweens.Easing.Sinusoidal.In, true);
            });

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
                    285
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
                    435
                )
            );
        }
    }
}
