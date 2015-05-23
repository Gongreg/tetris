/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../gameObjects/shape.ts" />
/// <reference path="../gameObjects/board.ts" />

class MainState extends Kiwi.State
{

    private currentShape: Shapes.Shape;

    private dropTimer: Kiwi.Time.Timer;
    private moveTimer: Kiwi.Time.Timer;

    private leftKey: Kiwi.Input.Key;
    private rightKey: Kiwi.Input.Key;
    private downKey: Kiwi.Input.Key;

    private pressed: boolean = false;

    private board: Board;

    private blocks: string[] = [
        'blue',
        'cyan',
        'green',
        'orange',
        'purple',
        'red',
        'yellow'
    ];

    private shapes: string[] = [
        'I',
        'J',
        'L',
        'O',
        'S',
        'T',
        'Z'
    ];

    preload()
    {
        super.preload();
        this.addImage('board', 'assets/img/board.png');
        this.addImage('borders', 'assets/img/borders.png');

        for (var index in this.blocks) {
            var color : string = this.blocks[index];
            this.addImage('block-'+ color, 'assets/img/block-'+ color +'.png');
        }

    }

    update()
    {
        super.update();

        if (this.leftKey.isDown && this.board.canMove(this.currentShape.getBlocks(), -1) && !this.pressed) {

            this.board.setBlocks(this.currentShape.getBlocks(), false);
            this.currentShape.move(-1);
            this.board.setBlocks(this.currentShape.getBlocks(), true);

            this.pressed = true;
            this.moveTimer.start();

        }

        if (this.rightKey.isDown && this.board.canMove(this.currentShape.getBlocks(), 1) && !this.pressed) {

            this.board.setBlocks(this.currentShape.getBlocks(), false);
            this.currentShape.move(1);
            this.board.setBlocks(this.currentShape.getBlocks(), true);

            this.pressed = true;
            this.moveTimer.start();

        }

        this.dropTimer.start();
    }

    resetControls()
    {
        this.pressed = false;
    }

    //drop down event
    dropDown()
    {
        if (this.board.canFall(this.currentShape.getBlocks())) {
            this.board.setBlocks(this.currentShape.getBlocks(), false);
            this.currentShape.fall();
            this.board.setBlocks(this.currentShape.getBlocks(), true);
            return;
        }

        //if unable to create new shape gg
        this.createNewShape();
    }


    createNewShape()
    {
        var shapeName = Math.floor(Math.random() * 7);

        this.currentShape = new Shapes['Shape'+ this.shapes[shapeName]](this, 3, 0);

        this.board.setBlocks(this.currentShape.getBlocks(), true);

        this.addChild(this.currentShape.getGameObject());
    }

    create()
    {
        super.create();

        //controls
        this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
        this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
        this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);

        //move timer for limiting move amount
        this.moveTimer = this.game.time.clock.createTimer('move', 0.1, 0);
        this.moveTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.resetControls, this);

        //board
        this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.borders, 0, 0));
        this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.board, 5, 5));
        this.board = new Board();

        //drop the first shape

        this.createNewShape();

        this.dropTimer = this.game.time.clock.createTimer('fall', 0.05, 0);
        this.dropTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.dropDown, this);
        this.dropTimer.start();


    }
}