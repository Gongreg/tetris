/// <reference path="shape.ts" />
/// <reference path="position.ts" />
/// <reference path="../enums.ts" />
/// <reference path="../config.ts" />
var Tetris;
(function (Tetris) {
    var Board = (function () {
        function Board() {
            this.height = Tetris.Config.boardHeight;
            this.width = Tetris.Config.boardWidth;
            //blocks array to keep track of blocks inside game
            this.blocks = [];
            for (var i = -2; i < 20; i++) {
                this.blocks[i] = [];
            }
        }
        //check if give positions are empty
        Board.prototype.emptyPositions = function (positions) {
            for (var i = 0; i < positions.length; i++) {
                var position = positions[i];
                if (position.x < 0 || position.x > this.width - 1 || position.y > this.height - 1 || position.y < -2 || this.blocks[position.y][position.x]) {
                    return false;
                }
            }
            return true;
        };
        //check if direction is empty
        Board.prototype.emptyDirection = function (blocks, direction) {
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                if ((direction === 4 /* Down */ && (block.y === this.height - 1 || this.blocks[block.y + 1][block.x])) || (direction === -1 /* Left */ && (block.x === 0 || this.blocks[block.y][block.x - 1])) || (direction === 1 /* Right */ && (block.x === this.width - 1 || this.blocks[block.y][block.x + 1]))) {
                    return false;
                }
            }
            return true;
        };
        //set status for blocks
        Board.prototype.setBlocks = function (blocks, status) {
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                this.blocks[block.y][block.x] = status === 1 /* Taken */ ? block : null;
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
                    if (!this.blocks[rowNumber][j]) {
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
                        if (this.blocks[i][j]) {
                            var block = this.blocks[i][j];
                            this.setBlocks([block], 0 /* Empty */);
                            block.setPosition(block.x, block.y + lowerBy);
                            this.setBlocks([block], 1 /* Taken */);
                        }
                    }
                }
            }
        };
        //return number of rows to fall
        Board.prototype.findLowestPossible = function (blocks) {
            var rowsToFall = this.height;
            for (var index in blocks) {
                var block = blocks[index];
                for (var j = block.y + 1; j < this.height; j++) {
                    if (this.blocks[j][block.x]) {
                        break;
                    }
                }
                var distance = Math.sqrt((j - block.y) * (j - block.y)) - 1;
                if (distance !== 0 && distance < rowsToFall) {
                    rowsToFall = j - block.y - 1;
                }
            }
            console.log('rtf: ' + rowsToFall);
            return rowsToFall;
        };
        return Board;
    })();
    Tetris.Board = Board;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=board.js.map