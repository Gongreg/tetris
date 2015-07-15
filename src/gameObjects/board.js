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
            for (var i = 0; i < this.height; i++) {
                this.blocks[i] = [];
            }
        }
        //check if given positions are empty
        Board.prototype.emptyPositions = function (positions) {
            var _this = this;
            return positions.filter(function (position) {
                return position.x < 0 || position.x > _this.width - 1 || position.y > _this.height - 1 || position.y < 0 || _this.blocks[position.y][position.x] !== undefined;
            }).length === 0;
        };
        //check blocks next to given ones are empty
        Board.prototype.emptyDirection = function (blocks, direction) {
            var _this = this;
            return blocks.filter(function (block) {
                return (direction === 4 /* Down */ && (block.y === _this.height - 1 || _this.blocks[block.y + 1][block.x] !== undefined)) || (direction === -1 /* Left */ && (block.x === 0 || _this.blocks[block.y][block.x - 1] !== undefined)) || (direction === 1 /* Right */ && (block.x === _this.width - 1 || _this.blocks[block.y][block.x + 1] !== undefined));
            }).length === 0;
        };
        //set status for blocks
        Board.prototype.setBlocks = function (blocks, status) {
            var _this = this;
            blocks.forEach(function (block) {
                _this.blocks[block.y][block.x] = status === 1 /* Taken */ ? block : undefined;
            });
            return this;
        };
        //check for rows to clear and return amount of cleared rows
        Board.prototype.checkRows = function (blocks) {
            var rowsToClear = this.getRowsToClear(blocks);
            this.clearRows(rowsToClear);
            //after clearing the rows, make other blocks fall down
            this.fallBlocks(rowsToClear);
            return rowsToClear.length;
        };
        //find full rows
        Board.prototype.getRowsToClear = function (blocks) {
            var _this = this;
            //no duplicates
            var rowsToClear = R.uniq(blocks.filter(function (block) {
                //only if full row
                return (_this.blocks[block.y].length === _this.width && !R.contains(undefined, _this.blocks[block.y]));
            }).map(function (block) {
                //only return rows
                return block.y;
            }));
            //reverse sort
            return R.sort(function (a, b) {
                return b - a;
            }, rowsToClear);
        };
        Board.prototype.clearRows = function (rowNumbers) {
            var _this = this;
            rowNumbers.forEach(function (rowNumber) {
                //destroy all blocks ion row
                _this.blocks[rowNumber].forEach(function (block) {
                    block.destroy();
                });
                //set all row empty
                _this.setBlocks(_this.blocks[rowNumber], 0 /* Empty */);
            });
        };
        Board.prototype.fallRowsBy = function (fromRow, toRow, lowerBy) {
            var _this = this;
            //first get all rows which need to be checked, reverse them (so we wouldnt overwrite blocks in board), then get all blocks in them and do make them go down
            R.flatten(R.reverse(this.blocks.filter(function (blocks, index) {
                return index <= fromRow && index >= toRow;
            }))).filter(function (block) {
                return block !== undefined;
            }).forEach(function (block) {
                _this.setBlocks([block], 0 /* Empty */);
                block.setPosition(block.x, block.y + lowerBy);
                _this.setBlocks([block], 1 /* Taken */);
            });
        };
        Board.prototype.fallBlocks = function (rowsToFall, lowerBy) {
            if (lowerBy === void 0) { lowerBy = 0; }
            //how many times are we still going to call this
            var remainingRowsToClear = rowsToFall.slice(1);
            //from which row to clear
            var fromRow = rowsToFall[0];
            //till what row to clear
            var toRow = rowsToFall.length === 1 ? 0 : rowsToFall[1];
            //how much block should fall down
            lowerBy += 1;
            this.fallRowsBy(fromRow, toRow, lowerBy);
            if (remainingRowsToClear.length > 0) {
                this.fallBlocks(remainingRowsToClear, lowerBy);
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
            return rowsToFall;
        };
        return Board;
    })();
    Tetris.Board = Board;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=board.js.map