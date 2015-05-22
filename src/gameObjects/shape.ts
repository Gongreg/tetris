/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="block.ts" />

class Shape
{

    protected cubeSize: number = 30;

    protected gameObject : Kiwi.Group;

    protected state: Kiwi.State;

    protected blocks: Block[] = [];

    constructor(state: Kiwi.State)
    {
        this.state = state;
        this.gameObject = new Kiwi.Group(state);
    }

    protected addBlock(texture : string, x : number, y : number)
    {
        var sprite: Kiwi.GameObjects.Sprite = new Kiwi.GameObjects.Sprite(
            this.state,
            this.state.textures[texture],
            4 + x * (this.cubeSize - 1),
            4 + y * (this.cubeSize - 1)
        );


        this.blocks.push(new Block(x, y, sprite));

        this.gameObject.addChildAt(
            sprite,
            this.blocks.length - 1
        );
    }

    public getGameObject()
    {
        return this.gameObject;
    }



    public fall()
    {
            for (var index in this.blocks) {
                var block: Block = this.blocks[index];

                block.fall();
                this.gameObject.getChildAt(index).transform.y += this.cubeSize - 1;
            }

    }

    move(side: number)
    {
        for (var index in this.blocks) {
                var block: Block = this.blocks[index];
                block.move(side);
                this.gameObject.getChildAt(index).transform.x += side * (this.cubeSize - 1);
        }
    }

}