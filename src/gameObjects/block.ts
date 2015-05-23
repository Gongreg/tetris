/**
 * Created by Gytis on 2015-05-22.
 */
/// <reference path="../../lib/kiwi.d.ts" />
class Block {

    public x: number;
    public y: number;
    private sprite: Kiwi.GameObjects.Sprite;
    public status: number;
    constructor(x :number, y : number, sprite: Kiwi.GameObjects.Sprite)
    {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }

    fall()
    {
        this.y++;
    }

    move(side: number)
    {
        this.x += side;
    }
}