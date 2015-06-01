/// <reference path="shape.ts" />
/// <reference path="position.ts" />
/// <reference path="../enums.ts" />
var Tetris;
(function (Tetris) {
    var Board = (function () {
        function Board() {
            /**
             * 0 empty
             * 1 taken by other
             * 2 taken by current
             * @type {Array}
             */
            this.isTaken = [];
            this.height = 20;
            this.width = 10;
            //blocks array to keep track of blocks inside game
            this.blocks = [];
            for (var i = -2; i < 20; i++) {
                this.isTaken[i] = [];
                this.blocks[i] = [];
                for (var j = 0; j < 10; j++) {
                    this.isTaken[i][j] = 0;
                }
            }
        }
        //check if give positions are empty
        Board.prototype.emptyPositions = function (positions) {
            for (var i = 0; i < positions.length; i++) {
                var position = positions[i];
                if (position.x < 0 || position.x > this.width - 1 || position.y > this.height - 1 || position.y < -2 || this.isTaken[position.y][position.x] == 1 /* Taken */) {
                    return false;
                }
            }
            return true;
        };
        //check if direction is empty
        Board.prototype.emptyDirection = function (blocks, direction) {
            var empty = true;
            this.setBlocks(blocks, 2 /* CurrentShape */);
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                if (direction == 4 /* Down */ && (block.y == this.height - 1 || this.isTaken[block.y + 1][block.x] == 1 /* Taken */)) {
                    empty = false;
                    break;
                }
                if (direction == -1 /* Left */ && (block.x == 0 || this.isTaken[block.y][block.x - 1] == 1 /* Taken */)) {
                    empty = false;
                    break;
                }
                if (direction == 1 /* Right */ && (block.x == this.width - 1 || this.isTaken[block.y][block.x + 1] == 1 /* Taken */)) {
                    empty = false;
                    break;
                }
            }
            this.setBlocks(blocks, 1 /* Taken */);
            return empty;
        };
        //set status for blocks
        Board.prototype.setBlocks = function (blocks, status) {
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                this.isTaken[block.y][block.x] = status;
                if (status == 1 /* Taken */) {
                    this.blocks[block.y][block.x] = block;
                }
                if (status == 0 /* Empty */) {
                    this.blocks[block.y][block.x] = null;
                }
            }
        };
        //check for rows to clear and return amount of cleared rows
        Board.prototype.checkRows = function (blocks) {
            var rowsToClear = this.getRowsToClear(blocks);
            for (var index in rowsToClear) {
                this.clearRow(rowsToClear[index]);
            }
            this.fallBlocks(rowsToClear);
            return rowsToClear.length;
        };
        //find full rows
        Board.prototype.getRowsToClear = function (blocks) {
            var rowsToClear = [];
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                var rowNumber = block.y;
                //if this row is already added skip it
                if (rowsToClear.indexOf(rowNumber) !== -1) {
                    continue;
                }
                var rowFull = true;
                for (var j = 0; j < this.width; j++) {
                    if (!this.isTaken[rowNumber][j]) {
                        rowFull = false;
                        break;
                    }
                }
                if (rowFull) {
                    rowsToClear.push(rowNumber);
                }
            }
            rowsToClear.sort();
            rowsToClear.reverse();
            return rowsToClear;
        };
        Board.prototype.clearRow = function (rowNumber) {
            for (var i = 0; i < this.width; i++) {
                this.blocks[rowNumber][i].destroy();
            }
            this.setBlocks(this.blocks[rowNumber], 0 /* Empty */);
        };
        Board.prototype.fallBlocks = function (rowsToClear) {
            var rowCount = rowsToClear.length;
            for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                //from which row to clear
                var fromRow = rowsToClear[rowIndex];
                //till what row to clear
                var toRow;
                //if it is the last row, check whole board
                if (rowIndex == rowCount - 1) {
                    toRow = 0;
                }
                else {
                    toRow = rowsToClear[rowIndex + 1];
                }
                //how much block should fall down
                var lowerBy = rowIndex + 1;
                for (var i = fromRow; i >= toRow; i--) {
                    for (var j = 0; j < this.width; j++) {
                        if (this.isTaken[i][j] == 1 /* Taken */) {
                            var block = this.blocks[i][j];
                            this.setBlocks([block], 0 /* Empty */);
                            block.setPosition(block.x, block.y + lowerBy);
                            this.setBlocks([block], 1 /* Taken */);
                        }
                    }
                }
            }
        };
        return Board;
    })();
    Tetris.Board = Board;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=board.js.map