/**
 * Created by Gytis on 2015-05-22.
 */
/// <reference path="../../lib/kiwi.d.ts" />
class Block {

    public x: number;
    public y: number;
    public sprite: Kiwi.GameObjects.Sprite;
    public status: number;

    protected size: number = 30;

    constructor(x :number, y : number, state: Kiwi.State, texture: Kiwi.Textures.TextureAtlas)
    {
        this.x = x;
        this.y = y;
        this.sprite = new Kiwi.GameObjects.Sprite(
            state,
            texture,
            4 + x * (this.size - 1),
            84 + y * (this.size - 1)
        );
    }

    fall()
    {
        this.y++;
        this.sprite.transform.y += this.size - 1;
    }

    move(side:number)
    {
        this.x += side;
        this.sprite.transform.x += side * (this.size - 1);
    }

    setPosition(x:number, y:number)
    {
        var xDiff: number = x - this.x;
        var yDiff: number = y - this.y;

        this.x = x;
        this.y = y;
        this.sprite.transform.x += xDiff * (this.size - 1);
        this.sprite.transform.y += yDiff * (this.size - 1);
    }
}