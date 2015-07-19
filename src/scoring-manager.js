/**
 * Created by Gytis on 2015-07-05.
 */
/// <reference path="../lib/kiwi.d.ts" />
var Tetris;
(function (Tetris) {
    var ScoringManager = (function () {
        function ScoringManager(level) {
            if (level === void 0) { level = 1; }
            this.score = 0;
            this.level = 1;
            this.rowsCleared = 0;
            this.level = level;
        }
        ScoringManager.prototype.checkLevel = function (rowsCleared) {
            this.rowsCleared += rowsCleared;
            if (this.rowsCleared > this.level * 10) {
                this.level++;
            }
        };
        ScoringManager.prototype.getInfo = function () {
            return {
                score: this.score,
                level: this.level,
                lines: this.rowsCleared
            };
        };
        ScoringManager.prototype.getFallingDelay = function () {
            var level = this.level < 10 ? this.level : 10;
            return (11 - level) * 0.05;
        };
        ScoringManager.prototype.addRowsCleared = function (rowsCleared) {
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
        };
        ScoringManager.prototype.addSoftDrop = function () {
            this.score++;
        };
        ScoringManager.prototype.addHardDrop = function (amountOfRows) {
            this.score += 2 * amountOfRows;
        };
        return ScoringManager;
    })();
    Tetris.ScoringManager = ScoringManager;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=scoring-manager.js.map