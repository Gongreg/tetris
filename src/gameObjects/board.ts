/**
 * Created by Gytis on 2015-05-22.
 */
/// <reference path="shape.ts" />
class Board
{
    /**
     * 0 empty
     * 1 taken by other
     * 2 taken by current
     * @type {Array}
     */
    private isTaken: Array<Array<number>> = [];

    constructor()
    {
        for (var i:number = 0; i < 20; i++) {
            this.isTaken[i] = [];
            for (var j:number = 0; j < 10; j++) {
                this.isTaken[i][j] = 0;
            }
        }
    }

    private setCurrentShapeBlocks(blocks: Block[], reset: boolean) {

        var status: number = (reset) ? 1 : 2;

        for (var index in blocks) {
            var block: Block = blocks[index];

            this.isTaken[block.y][block.x] = status;
        }
    }

    public canFall(blocks: Block[])
    {
        this.setCurrentShapeBlocks(blocks, false);
        for (var index in blocks) {
            var block: Block = blocks[index];

            if (block.y == 19 || this.isTaken[block.y + 1][block.x] == 1) {
                this.setCurrentShapeBlocks(blocks, true);
                return false;
            }
        }

        this.setCurrentShapeBlocks(blocks, true);
        return true;
    }

    public canMove(blocks: Block[], x: number)
    {
        this.setCurrentShapeBlocks(blocks, false);
        for (var index in blocks) {
            var block: Block = blocks[index];
            if (x < 0 && (block.x == 0 || this.isTaken[block.y][block.x - 1] == 1)) {
                this.setCurrentShapeBlocks(blocks, true);
                return false;
            }

            if (x > 0 && (block.x == 9 ||  this.isTaken[block.y][block.x + 1] == 1)) {
                this.setCurrentShapeBlocks(blocks, true);
                return false;
            }
        }

        this.setCurrentShapeBlocks(blocks, true);
        return true;
    }

    public setBlocks(blocks: Block[], taken: boolean)
    {
        var status: number = (taken) ? 1 : 0;

        for (var index in blocks) {
            var block: Block = blocks[index];
            this.isTaken[block.y][block.x] = status;
        }
    }

}