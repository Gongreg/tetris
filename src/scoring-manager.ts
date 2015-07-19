/**
 * Created by Gytis on 2015-07-05.
 */
/// <reference path="../lib/kiwi.d.ts" />

module Tetris {
    export class ScoringManager {
        private score: number = 0;
        private level: number = 1;

        private rowsCleared: number = 0;

        constructor(level: number = 1) {
            this.level = level;
        }

        private checkLevel(rowsCleared) {
            this.rowsCleared += rowsCleared;

            if (this.rowsCleared > this.level * 10) {
                this.level++;
            }
        }

        public getInfo() {
            return {
                score: this.score,
                level: this.level
            }
        }

        public getFallingDelay() {

            var level = this.level < 10 ? this.level : 10;

            return (11 - level) * 0.05;
        }

        addRowsCleared(rowsCleared: number) {
            switch (rowsCleared) {
                case 1:
                    this.score += 40 * this.level;
                    break;
                case 2:
                    this.score += 100 * this.level;
                    break;
                case 3:
                    this.score += 300 * this.level;
                    break;
                case 4:
                    this.score += 1200 * this.level;
                    break;
                default:
                    return;
            }

            this.checkLevel(rowsCleared);
        }

        addSoftDrop() {
            this.score++;
        }

        addHardDrop(amountOfRows: number) {
            this.score += 2 * amountOfRows;
        }
    }
}
