/**
 * Created by Gytis on 2015-05-22.
 */
/// <reference path="shape.ts" />
class Board
{
    private isTaken: Array<Array<Boolean>> = [];

    constructor()
    {
        for (var i:number = 0; i < 20; i++) {
            this.isTaken[i] = [];
            for (var j:number = 0; j < 10; j++) {
                this.isTaken[i][j] = false;
            }
        }
    }

    public canMove(currentShape: Shape, x: number, y: number)
    {

        return true;
    }

}