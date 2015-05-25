/**
 * Created by Gytis on 2015-05-22.
 */
/// <reference path="shape.ts" />
enum BlockStatus {
    Empty,
    Taken,
    CurrentShape
}

class Board
{
    /**
     * 0 empty
     * 1 taken by other
     * 2 taken by current
     * @type {Array}
     */
    private isTaken: Array<Array<number>> = [];

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

    public canFall(blocks: Block[])
    {
        this.setBlocks(blocks, BlockStatus.CurrentShape);
        for (var index in blocks) {
            var block: Block = blocks[index];

            if (block.y == 19 || this.isTaken[block.y + 1][block.x] == 1) {
                this.setBlocks(blocks, BlockStatus.Taken);
                return false;
            }
        }

        this.setBlocks(blocks, BlockStatus.Taken);
        return true;
    }

    public canMove(blocks: Block[], x: number)
    {
        this.setBlocks(blocks, BlockStatus.CurrentShape);
        for (var index in blocks) {
            var block: Block = blocks[index];
            if (x < 0 && (block.x == 0 || this.isTaken[block.y][block.x - 1] == 1)) {
                this.setBlocks(blocks, BlockStatus.Taken);
                return false;
            }

            if (x > 0 && (block.x == 9 ||  this.isTaken[block.y][block.x + 1] == 1)) {
                this.setBlocks(blocks, BlockStatus.Taken);
                return false;
            }
        }

        this.setBlocks(blocks, BlockStatus.Taken);
        return true;
    }

    public setBlocks(blocks: Block[], status: number)
    {

        for (var index in blocks) {
            var block: Block = blocks[index];

            this.isTaken[block.y][block.x] = status;

            if (status == BlockStatus.Taken) {
                this.blocks[block.y][block.x] = block;
            }

            if (status == BlockStatus.Empty) {
                this.blocks[block.y][block.x] = null;
            }

        }
    }

    public canCreateShape(blocks: Block[])
    {
        for (var index in blocks) {
            var block: Block = blocks[index];

            if (this.isTaken[block.y][block.x]) {
                return false;
            }
        }
        return true;
    }

    private getRowsToClear(blocks: Block[])
    {
        var rowsToClear: number[] = [];

        for (var index in blocks) {
            var block:Block = blocks[index];

            var rowNumber:number = block.y;

            if (rowsToClear.indexOf(rowNumber) !== -1) {
                continue;
            }

            var rowFull:boolean = true;
            for (var i:number = 0; i < 10; i++) {
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
    }

    public clearRows(blocks: Block[]) {
        var rowsToClear: number[] = this.getRowsToClear(blocks);

        var lowestRow: number = -1;

        for (var index in rowsToClear) {

            var rowNumber:number = rowsToClear[index];

            if (rowNumber > lowestRow) {
                lowestRow = rowNumber;
            }

            //clear required rows
            for (var i:number = 0; i < 10; i++) {
                this.blocks[rowNumber][i].destroy();
            }

            this.setBlocks(this.blocks[rowNumber], BlockStatus.Empty);
        }

        var rowCount: number = rowsToClear.length;

        if (rowCount > 0) {
            for (var i: number = lowestRow - 1; i >= 0; i--) {
                for (var j:number = 0; j < 10; j++) {
                    if (this.isTaken[i][j] == BlockStatus.Taken) {

                        var block: Block = this.blocks[i][j];

                        this.setBlocks([block], BlockStatus.Empty);
                        block.setPosition(block.x, block.y + rowCount);
                        this.setBlocks([block], BlockStatus.Taken);
                    }
                }
            }
        }

        return rowCount;
    }


    blocksEmpty(positions: PositionI[])
    {
        for (var index in positions) {

            var position: PositionI = positions[index];

            if (position.x < 0
                || position.x > 9
                || position.y > 19
                || position.y < -2
                || this.isTaken[position.y][position.x] == BlockStatus.Taken
            ){
                return false;
            }

        }

        return true;
    }

}