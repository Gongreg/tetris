/// <reference path="shape.ts" />

class ShapeI extends Shape {

    private blockColor : string = 'blockcyan';

    constructor(state: Kiwi.State, x : number, y : number)
    {
        super(state);
        this.addBlock(this.blockColor, x, y);
        this.addBlock(this.blockColor, x+1, y);
        this.addBlock(this.blockColor, x+2, y);
        this.addBlock(this.blockColor, x+3, y);

    }

}