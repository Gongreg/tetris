/**
 * Created by Gytis on 2015-07-05.
 */
/// <reference path="./gameObjects/shape.ts" />
/// <reference path="../lib/kiwi.d.ts" />
module Tetris {
    export class Hud {
        private score: Kiwi.GameObjects.TextField;
        private currentScore: number = 0;
        private shape: Shapes.Shape;

        constructor(score: Kiwi.GameObjects.TextField)
        {
            this.score = score;
        }

        addScore(score: number) {
            this.currentScore += score;
            this.score.text = this.currentScore.toString();
        }
    }
}
