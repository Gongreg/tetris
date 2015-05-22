/**
 * Created by Gytis on 2015-05-22.
 */
/// <reference path="shape.ts" />
var Board = (function () {
    function Board() {
        this.isTaken = [];
        for (var i = 0; i < 20; i++) {
            this.isTaken[i] = [];
            for (var j = 0; j < 10; j++) {
                this.isTaken[i][j] = false;
            }
        }
    }
    Board.prototype.canMove = function (currentShape, x, y) {
        return true;
    };
    return Board;
})();
//# sourceMappingURL=board.js.map