/// <reference path="shapes/shape.ts" />
/// <reference path="position.ts" />
/// <reference path="../enums.ts" />
/// <reference path="../config.ts" />

module Tetris {

    export class Board
    {

        private height: number = Config.boardHeight;
        private width: number = Config.boardWidth;

        //blocks array to keep track of blocks inside game
        private blocks: Array<Array<Block>> = [];

        private highestPositions: Position[] = [];

        constructor() {
            for (var i:number = 0; i < this.height; i++) {
                this.blocks[i] = [];
            }

            for (var i:number = 0; i < this.width; i++) {
                this.highestPositions[i] = new Position(i, this.height);
            }
        }

        //check if given positions are empty
        public emptyPositions(positions: Position[]) {

            return positions.filter(position => {
                    return position.x < 0
                        || position.x > this.width - 1
                        || position.y > this.height - 1
                        || position.y < 0
                        || this.blocks[position.y][position.x] !== undefined;
                }).length === 0;
        }

        //check blocks next to given ones are empty
        public emptyDirection(blocks: Block[], direction: number) {

            return blocks.filter(block => {
                    return (direction === Direction.Down && (block.y === this.height - 1 || this.blocks[block.y + 1][block.x] !== undefined))
                        || (direction === Direction.Left && (block.x === 0 || this.blocks[block.y][block.x - 1] !== undefined))
                        || (direction === Direction.Right && (block.x === this.width - 1 ||  this.blocks[block.y][block.x + 1] !== undefined));
                }).length === 0;
        }

        private refreshHighestPosition(position: Position) {

            this.highestPositions[position.x] =
                this.highestPositions[position.x].isLower(position) ? position : this.highestPositions[position.x];
        }

        public refreshHighestPositions(positions: Position[] = [])
        {
            this.highestPositions.forEach((highestPosition, column) => {
                this.highestPositions[column].y = this.height;

                var from = positions.filter(position => position.x == column).map(position => position.y)[0];

                from = from ? from : 0;

                for (var i = from; i < this.height; i++) {
                    if (this.blocks[i][column]) {
                        this.highestPositions[column].y = i;
                        break;
                    }

                }

            });
        }

    //set status for blocks
        public setBlocks(blocks: Block[], status: number = BlockStatus.Taken) {
            blocks.forEach(block => {
                this.blocks[block.y][block.x] = status === BlockStatus.Taken ? block : undefined;
                if (status === BlockStatus.Taken) {
                    this.refreshHighestPosition(block.getPosition());
                }
            });

            return this;
        }

        //check for rows to clear and return amount of cleared rows
        public checkRows(blocks: Block[]) {
            var rowsToClear: number[] = this.getRowsToClear(blocks);

            if (rowsToClear.length > 0) {
                this.clearRows(rowsToClear);

                //after clearing the rows, make other blocks fall down
                this.fallBlocks(rowsToClear);

                //refresh highest positions because some rows can get empty or some gaps can happen
                this.refreshHighestPositions();
            }


            return rowsToClear.length;
        }

        //find full rows
        private getRowsToClear(blocks: Block[]) {
            //no duplicates
            var rowsToClear: number[] = R.uniq(
                blocks
                    .filter((block) => {
                        //only if full row (all blocks set and none of them are undefined)
                        return (this.blocks[block.y].length === this.width && !R.contains(undefined, this.blocks[block.y]));
                        //only return rows
                    }).map(block => block.y)
            );

            //reverse sort
            return R.sort((a,b) => {
                return b - a;
            }, rowsToClear);
        }

        private clearRows(rowNumbers: number[]) {
            rowNumbers.forEach((rowNumber) => {
                //destroy all blocks in row
                this.blocks[rowNumber].forEach(block => block.destroy());
                //set all row empty
                this.setBlocks(this.blocks[rowNumber], BlockStatus.Empty);
            });
        }

        private fallBlocks(rowsToFall: number[]) {
            rowsToFall.forEach((fromRow, index) => {

                var lowerBy = index + 1;

                //till what row to clear
                var toRow: number = rowsToFall[lowerBy] ? rowsToFall[lowerBy] : 0;

                //flatten arrays into one
                var blocksToFall = R.flatten(
                    //check from bottom to top
                    R.reverse(
                        //get all rows between highest and lowest
                        this.blocks.filter((blocks, row) => {
                            return row <= fromRow && row >= toRow;
                        })
                    )
                    //get only blocks (remove empty)
                ).filter(block => block !== undefined);

                //first get all rows which need to be checked, reverse them (so we wouldnt overwrite blocks in board), then get all blocks in them and do make them go down
                blocksToFall.forEach((block) => {
                    this.setBlocks([block], BlockStatus.Empty);
                    block.setPosition(block.x, block.y + lowerBy);
                    this.setBlocks([block], BlockStatus.Taken);
                });
            });
        }

        //return number of rows to fall
        public findDistanceToFall(positions: Position[]) {
            this.refreshHighestPositions(positions);
            return positions.reduce((rowsToFall, position) => {

                var distance: number = Math.sqrt(Math.pow(this.highestPositions[position.x].y - position.y, 2)) - 1;

                return distance < rowsToFall ? distance : rowsToFall;
            }, this.height);
        }
    }
}

