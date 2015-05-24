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
    private upKey: Kiwi.Input.Key;

    private pressed: boolean = false;
    private rotating: boolean = false;

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

            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Empty);
            this.currentShape.move(-1);
            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

            this.pressed = true;
            this.moveTimer.start();

        }

        if (this.rightKey.isDown && this.board.canMove(this.currentShape.getBlocks(), 1) && !this.pressed) {

            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Empty);
            this.currentShape.move(1);
            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

            this.pressed = true;
            this.moveTimer.start();

        }

        if (this.upKey.isDown && !this.rotating) {
            this.rotating = true;

            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Empty);
            this.currentShape.rotate();
            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

        }

        if (this.upKey.isUp) {
            this.rotating = false;
        }

        if (this.downKey.isDown) {

            this.dropTimer.delay = 0.001;


        } else {
            this.dropTimer.delay = 0.5;
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
            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Empty);
            this.currentShape.fall();
            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);
            return;
        }

        //try to clear the row
        this.board.clearRows(this.currentShape.getBlocks());

        this.createEmptyShape();

        if (this.board.canCreateShape(this.currentShape.getBlocks())) {

            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

            this.addChild(this.currentShape.getGameObject());

            return;
        }

        //console.log('gg');
        //if unable to create new shape gg
    }

    randomShape()
    {
        return 'Shape'+ this.shapes[Math.floor(Math.random() * 7)];
    }

    createEmptyShape(shapeName: string = '', x: number = 4, y: number = -1)
    {
        if (shapeName.length == 0) {
            shapeName = this.randomShape();
        }


        this.currentShape = new Shapes[shapeName](this, x, y);
    }

    createNewShape(shapeName: string = '', x: number = 4, y: number = -1)
    {

        if (shapeName.length == 0) {
            shapeName = this.randomShape();
        }

        this.currentShape = new Shapes[shapeName](this, x, y);

        this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

        this.addChild(this.currentShape.getGameObject());
    }

    create()
    {
        super.create();

        //controls
        this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
        this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
        this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);
        this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);

        //move timer for limiting move amount
        this.moveTimer = this.game.time.clock.createTimer('move', 0.1, 0);
        this.moveTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.resetControls, this);

        //board
        this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.borders, 0, 80));
        this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.board, 5, 85));
        this.board = new Board();

        //drop the first shape


        this.createNewShape('ShapeI', 0, 19);
        this.createNewShape('ShapeI', 4, 19);
        this.createNewShape('ShapeI', 0, 18);
        this.createNewShape('ShapeI', 4, 18);
        this.createNewShape('ShapeLol', 9, 16);

        this.dropTimer = this.game.time.clock.createTimer('fall', 0.5, 0);
        this.dropTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.dropDown, this);
        this.dropTimer.start();


    }
}