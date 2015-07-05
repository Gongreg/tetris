/// <reference path="shape.ts" />
/// <reference path="position.ts" />
/// <reference path="../enums.ts" />
/// <reference path="../config.ts" />

module Tetris {

    export class Board
    {
        /**
         * 0 empty
         * 1 taken by other
         * 2 taken by current
         * @type {Array}
         */
        private isTaken: Array<Array<number>> = [];

        private height: number = Config.boardHeight;
        private width: number = Config.boardWidth;

        //blocks array to keep track of blocks inside game
        private blocks: Array<Array<Block>> = [];

        constructor()
        {
            for (var i:number = -2; i < 20; i++) {
                this.isTaken[i] = [];
                this.blocks[i] = [];
                for (var j:number = 0; j < 10; j++) {
                    this.isTaken[i][j] = 0;
                }
            }
        }

        //check if give positions are empty
        public emptyPositions(positions: PositionI[])
        {
            for (var i: number = 0; i < positions.length; i++) {
                var position: PositionI = positions[i];

                if (position.x < 0
                    || position.x > this.width - 1
                    || position.y > this.height - 1
                    || position.y < -2
                    || this.isTaken[position.y][position.x] == BlockStatus.Taken
                ){
                    return false;
                }

            }

            return true;
        }

        //check if direction is empty
        public emptyDirection(blocks: Block[], direction: number)
        {
            var empty: boolean = true;
            this.setBlocks(blocks, BlockStatus.CurrentShape);
            for (var i: number = 0; i < blocks.length; i++) {
                var block: Block = blocks[i];

                if (direction == Direction.Down && (block.y == this.height - 1 || this.isTaken[block.y + 1][block.x] == BlockStatus.Taken)) {
                    empty = false;
                    break;
                }

                if (direction == Direction.Left && (block.x == 0 || this.isTaken[block.y][block.x - 1] == BlockStatus.Taken)) {
                    empty = false;
                    break;
                }

                if (direction == Direction.Right && (block.x == this.width - 1 ||  this.isTaken[block.y][block.x + 1] == BlockStatus.Taken)) {
                    empty = false;
                    break;
                }
            }

            this.setBlocks(blocks, BlockStatus.Taken);

            return empty;
        }

        //set status for blocks
        public setBlocks(blocks: Block[], status: number)
        {

            for (var i: number = 0; i < blocks.length; i++) {
                var block: Block = blocks[i];

                this.isTaken[block.y][block.x] = status;

                if (status == BlockStatus.Taken) {
                    this.blocks[block.y][block.x] = block;
                }

                if (status == BlockStatus.Empty) {
                    this.blocks[block.y][block.x] = null;
                }

            }
        }

        //check for rows to clear and return amount of cleared rows
        public checkRows(blocks: Block[]) {
            var rowsToClear: number[] = this.getRowsToClear(blocks);

            for (var index in rowsToClear) {
                this.clearRow(rowsToClear[index]);
            }

            this.fallBlocks(rowsToClear);

            return rowsToClear.length;
        }

        //find full rows
        private getRowsToClear(blocks: Block[])
        {
            var rowsToClear: number[] = [];

            for (var i: number = 0; i < blocks.length; i++) {
                var block: Block = blocks[i];

                var rowNumber:number = block.y;

                //if this row is already added skip it
                if (rowsToClear.indexOf(rowNumber) !== -1) {
                    continue;
                }

                var rowFull:boolean = true;
                for (var j:number = 0; j < this.width; j++) {
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
        }

        private clearRow(rowNumber: number)
        {

            for (var i:number = 0; i < this.width; i++) {
                this.blocks[rowNumber][i].destroy();
            }

            this.setBlocks(this.blocks[rowNumber], BlockStatus.Empty);
        }

        private fallBlocks(rowsToClear: number[])
        {

            var rowCount: number = rowsToClear.length;

            for (var rowIndex: number = 0; rowIndex < rowCount; rowIndex++) {

                //from which row to clear
                var fromRow: number = rowsToClear[rowIndex];

                //till what row to clear
                var toRow: number;

                //if it is the last row, check whole board
                if (rowIndex == rowCount - 1) {
                    toRow = 0;
                    //otherwise check till next row which was cleared
                } else {
                    toRow = rowsToClear[rowIndex + 1];
                }

                //how much block should fall down
                var lowerBy: number = rowIndex + 1;

                for (var i: number = fromRow; i >= toRow; i--) {
                    for (var j:number = 0; j < this.width; j++) {
                        if (this.isTaken[i][j] == BlockStatus.Taken) {

                            var block: Block = this.blocks[i][j];

                            this.setBlocks([block], BlockStatus.Empty);
                            block.setPosition(block.x, block.y + lowerBy);
                            this.setBlocks([block], BlockStatus.Taken);
                        }
                    }
                }
            }
        }

        //return number of rows to fall
        findLowestPossible(blocks: Block[])
        {
            var rowsToFall : number = 20;

            for (var i: number = 0; i < blocks.length; i++) {
                var block: Block = blocks[i];

                for (var j: number = block.y + 1; j < this.height; j++) {
                    if (this.isTaken[j][block.x] !== BlockStatus.Empty) {
                        break;
                    }
                }

                var distance: number = Math.sqrt((j - block.y) * (j - block.y)) - 1;

                if (distance !== 0 && distance < rowsToFall) {
                    rowsToFall = j - block.y - 1;
                }
            }

            console.log(rowsToFall);

            return rowsToFall;
        }
    }
}

