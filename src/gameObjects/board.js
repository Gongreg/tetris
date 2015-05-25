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
            if (status == 1 /* Taken */) {
                this.blocks[block.y][block.x] = block;
            }
            if (status == 0 /* Empty */) {
                this.blocks[block.y][block.x] = null;
            }
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
    Board.prototype.getRowsToClear = function (blocks) {
        var rowsToClear = [];
        for (var index in blocks) {
            var block = blocks[index];
            var rowNumber = block.y;
            if (rowsToClear.indexOf(rowNumber) !== -1) {
                continue;
            }
            var rowFull = true;
            for (var i = 0; i < 10; i++) {
                if (!this.isTaken[rowNumber][i]) {
                    rowFull = false;
                    break;
                }
            }
            if (rowFull) {
                rowsToClear.push(rowNumber);
            }
        }
        return rowsToClear;
    };
    Board.prototype.clearRows = function (blocks) {
        var rowsToClear = this.getRowsToClear(blocks);
        var lowestRow = -1;
        for (var index in rowsToClear) {
            var rowNumber = rowsToClear[index];
            if (rowNumber > lowestRow) {
                lowestRow = rowNumber;
            }
            for (var i = 0; i < 10; i++) {
                this.blocks[rowNumber][i].destroy();
            }
            this.setBlocks(this.blocks[rowNumber], 0 /* Empty */);
        }
        var rowCount = rowsToClear.length;
        if (rowCount > 0) {
            for (var i = lowestRow - 1; i >= 0; i--) {
                for (var j = 0; j < 10; j++) {
                    if (this.isTaken[i][j] == 1 /* Taken */) {
                        var block = this.blocks[i][j];
                        this.setBlocks([block], 0 /* Empty */);
                        block.setPosition(block.x, block.y + rowCount);
                        this.setBlocks([block], 1 /* Taken */);
                    }
                }
            }
        }
        return rowCount;
    };
    Board.prototype.blocksEmpty = function (positions) {
        for (var index in positions) {
            var position = positions[index];
            if (position.x < 0 || position.x > 9 || position.y > 19 || position.y < -2 || this.isTaken[position.y][position.x] == 1 /* Taken */) {
                return false;
            }
        }
        return true;
    };
    return Board;
})();
//# sourceMappingURL=board.js.map