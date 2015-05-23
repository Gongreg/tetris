/**
 * Created by Gytis on 2015-05-22.
 */
/// <reference path="shape.ts" />
var BlockStatus;
(function (BlockStatus) {
    BlockStatus[BlockStatus["Empty"] = 0] = "Empty";
    BlockStatus[BlockStatus["Taken"] = 1] = "Taken";
    BlockStatus[BlockStatus["CurrentShape"] = 2] = "CurrentShape";
})(BlockStatus || (BlockStatus = {}));
var Board = (function () {
    function Board() {
        /**
         * 0 empty
         * 1 taken by other
         * 2 taken by current
         * @type {Array}
         */
        this.isTaken = [];
        this.blocks = [];
        for (var i = -2; i < 20; i++) {
            this.isTaken[i] = [];
            this.blocks[i] = [];
            for (var j = 0; j < 10; j++) {
                this.isTaken[i][j] = 0;
            }
        }
    }
    Board.prototype.canFall = function (blocks) {
        this.setBlocks(blocks, 2 /* CurrentShape */);
        for (var index in blocks) {
            var block = blocks[index];
            if (block.y == 19 || this.isTaken[block.y + 1][block.x] == 1) {
                this.setBlocks(blocks, 1 /* Taken */);
                return false;
            }
        }
        this.setBlocks(blocks, 1 /* Taken */);
        return true;
    };
    Board.prototype.canMove = function (blocks, x) {
        this.setBlocks(blocks, 2 /* CurrentShape */);
        for (var index in blocks) {
            var block = blocks[index];
            if (x < 0 && (block.x == 0 || this.isTaken[block.y][block.x - 1] == 1)) {
                this.setBlocks(blocks, 1 /* Taken */);
                return false;
            }
            if (x > 0 && (block.x == 9 || this.isTaken[block.y][block.x + 1] == 1)) {
                this.setBlocks(blocks, 1 /* Taken */);
                return false;
            }
        }
        this.setBlocks(blocks, 1 /* Taken */);
        return true;
    };
    Board.prototype.setBlocks = function (blocks, status) {
        for (var index in blocks) {
            var block = blocks[index];
            this.isTaken[block.y][block.x] = status;
        }
    };
    Board.prototype.canCreateShape = function (blocks) {
        for (var index in blocks) {
            var block = blocks[index];
            if (this.isTaken[block.y][block.x]) {
                return false;
            }
        }
        return true;
    };
    return Board;
})();
//# sourceMappingURL=board.js.map