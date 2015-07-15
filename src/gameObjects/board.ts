/// <reference path="shape.ts" />
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

        constructor()
        {
            for (var i:number = 0; i < this.height; i++) {
                this.blocks[i] = [];
            }

        }

        //check if given positions are empty
        public emptyPositions(positions: Position[])
        {

            return positions.filter((position) => {
                    return position.x < 0
                        || position.x > this.width - 1
                        || position.y > this.height - 1
                        || position.y < 0
                        || this.blocks[position.y][position.x] !== undefined;
                }).length === 0;
        }

        //check blocks next to given ones are empty
        public emptyDirection(blocks: Block[], direction: number)
        {

            return blocks.filter((block) => {
                    return (direction === Direction.Down && (block.y === this.height - 1 || this.blocks[block.y + 1][block.x] !== undefined))
                        || (direction === Direction.Left && (block.x === 0 || this.blocks[block.y][block.x - 1] !== undefined))
                        || (direction === Direction.Right && (block.x === this.width - 1 ||  this.blocks[block.y][block.x + 1] !== undefined));
                }).length === 0;
        }

        //set status for blocks
        public setBlocks(blocks: Block[], status: number)
        {
            blocks.forEach((block) => {
                this.blocks[block.y][block.x] = status === BlockStatus.Taken ? block : undefined;
            });

            return this;
        }

        //check for rows to clear and return amount of cleared rows
        public checkRows(blocks: Block[]) {
            var rowsToClear: number[] = this.getRowsToClear(blocks);

            this.clearRows(rowsToClear);

            //after clearing the rows, make other blocks fall down
            this.fallBlocks(rowsToClear);

            return rowsToClear.length;
        }

        //find full rows
        private getRowsToClear(blocks: Block[])
        {
            //no duplicates
            var rowsToClear: number[] = R.uniq(
                blocks
                    .filter((block) => {
                        //only if full row
                        return (this.blocks[block.y].length === this.width && !R.contains(undefined, this.blocks[block.y]));
                    }).map((block) => {
                        //only return rows
                        return block.y;
                    })
            );

            //reverse sort
            return R.sort((a,b) => {
                return b - a;
            }, rowsToClear);
        }

        private clearRows(rowNumbers: number[])
        {
            rowNumbers.forEach((rowNumber) => {
                //destroy all blocks ion row
                this.blocks[rowNumber].forEach((block) => {block.destroy();});
                //set all row empty
                this.setBlocks(this.blocks[rowNumber], BlockStatus.Empty);
            });
        }

        private fallRowsBy(fromRow, toRow, lowerBy)
        {
            //first get all rows which need to be checked, reverse them (so we wouldnt overwrite blocks in board), then get all blocks in them and do make them go down
            R.flatten(R.reverse(this.blocks.filter((blocks, index) => {
                return index <= fromRow && index >= toRow;
            }))).filter((block) => { return block !== undefined; }).forEach((block) => {
                this.setBlocks([block], BlockStatus.Empty);
                block.setPosition(block.x, block.y + lowerBy);
                this.setBlocks([block], BlockStatus.Taken);
            });
        }

        private fallBlocks(rowsToFall: number[], lowerBy = 0)
        {

            //how many times are we still going to call this
            var remainingRowsToClear = rowsToFall.slice(1);

            //from which row to clear
            var fromRow: number = rowsToFall[0];

            //till what row to clear
            var toRow: number = rowsToFall.length === 1 ? 0 : rowsToFall[1];

            //how much block should fall down
            lowerBy += 1;

            this.fallRowsBy(fromRow, toRow, lowerBy);

            if (remainingRowsToClear.length > 0) {
                this.fallBlocks(remainingRowsToClear, lowerBy);
            }
        }

        //return number of rows to fall
        findLowestPossible(blocks: Block[])
        {
            var rowsToFall : number = this.height;

            for (var index in blocks) {

                var block: Block = blocks[index];

                //get only lowest in blocks

                for (var j: number = block.y + 1; j < this.height; j++) {
                    if (this.blocks[j][block.x]) {
                        break;
                    }
                }

                var distance: number = Math.sqrt((j - block.y) * (j - block.y)) - 1;

                if (distance !== 0 && distance < rowsToFall) {
                    rowsToFall = j - block.y - 1;
                }
            }

            return rowsToFall;
        }
    }
}

