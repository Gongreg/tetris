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
            this.highestPositions = [];
            for (var i = 0; i < this.height; i++) {
                this.blocks[i] = [];
            }
            for (var i = 0; i < this.width; i++) {
                this.highestPositions[i] = new Tetris.Position(i, this.height);
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
        Board.prototype.refreshHighestPosition = function (position) {
            this.highestPositions[position.x] = this.highestPositions[position.x].isLower(position) ? position : this.highestPositions[position.x];
        };
        Board.prototype.refreshHighestPositions = function (positions) {
            var _this = this;
            if (positions === void 0) { positions = []; }
            this.highestPositions.forEach(function (highestPosition, column) {
                _this.highestPositions[column].y = _this.height;
                var from = positions.filter(function (position) { return position.x == column; }).map(function (position) { return position.y; })[0];
                from = from ? from : 0;
                for (var i = from; i < _this.height; i++) {
                    if (_this.blocks[i][column]) {
                        _this.highestPositions[column].y = i;
                        break;
                    }
                }
            });
        };
        //set status for blocks
        Board.prototype.setBlocks = function (blocks, status) {
            var _this = this;
            if (status === void 0) { status = 1 /* Taken */; }
            blocks.forEach(function (block) {
                _this.blocks[block.y][block.x] = status === 1 /* Taken */ ? block : undefined;
                if (status === 1 /* Taken */) {
                    _this.refreshHighestPosition(block.getPosition());
                }
            });
            return this;
        };
        //check for rows to clear and return amount of cleared rows
        Board.prototype.checkRows = function (blocks) {
            var rowsToClear = this.getRowsToClear(blocks);
            if (rowsToClear.length > 0) {
                this.clearRows(rowsToClear);
                //after clearing the rows, make other blocks fall down
                this.fallBlocks(rowsToClear);
                //refresh highest positions because some rows can get empty or some gaps can happen
                this.refreshHighestPositions();
            }
            return rowsToClear.length;
        };
        //find full rows
        Board.prototype.getRowsToClear = function (blocks) {
            var _this = this;
            //no duplicates
            var rowsToClear = R.uniq(blocks.filter(function (block) {
                //only if full row (all blocks set and none of them are undefined)
                return (_this.blocks[block.y].length === _this.width && !R.contains(undefined, _this.blocks[block.y]));
                //only return rows
            }).map(function (block) { return block.y; }));
            //reverse sort
            return R.sort(function (a, b) {
                return b - a;
            }, rowsToClear);
        };
        Board.prototype.clearRows = function (rowNumbers) {
            var _this = this;
            rowNumbers.forEach(function (rowNumber) {
                //destroy all blocks in row
                _this.blocks[rowNumber].forEach(function (block) { return block.destroy(); });
                //set all row empty
                _this.setBlocks(_this.blocks[rowNumber], 0 /* Empty */);
            });
        };
        Board.prototype.fallBlocks = function (rowsToFall) {
            var _this = this;
            rowsToFall.forEach(function (fromRow, index) {
                var lowerBy = index + 1;
                //till what row to clear
                var toRow = rowsToFall[lowerBy] ? rowsToFall[lowerBy] : 0;
                //flatten arrays into one
                var blocksToFall = R.flatten(R.reverse(_this.blocks.filter(function (blocks, row) {
                    return row <= fromRow && row >= toRow;
                }))).filter(function (block) { return block !== undefined; });
                //first get all rows which need to be checked, reverse them (so we wouldnt overwrite blocks in board), then get all blocks in them and do make them go down
                blocksToFall.forEach(function (block) {
                    _this.setBlocks([block], 0 /* Empty */);
                    block.setPosition(block.x, block.y + lowerBy);
                    _this.setBlocks([block], 1 /* Taken */);
                });
            });
        };
        //return number of rows to fall
        Board.prototype.findDistanceToFall = function (positions) {
            var _this = this;
            this.refreshHighestPositions(positions);
            return positions.reduce(function (rowsToFall, position) {
                var distance = Math.sqrt(Math.pow(_this.highestPositions[position.x].y - position.y, 2)) - 1;
                return distance < rowsToFall ? distance : rowsToFall;
            }, this.height);
        };
        return Board;
    })();
    Tetris.Board = Board;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=board.js.map