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

    /*
    public checkRows(blocks: Block[])
    {
        for (var index in blocks) {
            var block: Block = blocks[index];

            for (var i: number = 0; i < 10; i++) {

            }

            if (this.isTaken[block.y][block.x]) {
                return false;
            }
        }
        return true;
    }
    */

}