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
    private zKey: Kiwi.Input.Key;
    private xKey: Kiwi.Input.Key;

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

    moveLeft()
    {
        if (this.leftKey.isDown && this.board.canMove(this.currentShape.getBlocks(), -1) && !this.pressed) {

            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Empty);
            this.currentShape.move(-1);
            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

            this.pressed = true;
            this.moveTimer.start();

        }
    }

    moveRight()
    {
        if (this.rightKey.isDown && this.board.canMove(this.currentShape.getBlocks(), 1) && !this.pressed) {

            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Empty);
            this.currentShape.move(1);
            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

            this.pressed = true;
            this.moveTimer.start();

        }
    }

    rotate()
    {
        var direction: number = 0;

        if (this.xKey.isDown && !this.rotating) {

            this.rotating = true;

            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.CurrentShape);

            var positions: PositionI[] = this.currentShape.getNextRotation();
            var rotated: boolean = false;
            while (positions.length > 0) {

                if (this.board.blocksEmpty(positions)) {
                    rotated = true;
                    this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Empty);
                    this.currentShape.rotate();
                    this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);
                    break;
                }

                if (rotated) {
                    break;
                }

                positions = this.currentShape.getNextRotation();
            }

            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

        }

        if (this.xKey.isUp) {
            this.rotating = false;
        }




    }

    changeDelay()
    {
        if (this.downKey.isDown) {

            this.dropTimer.delay = 0.001;

        } else {
            this.dropTimer.delay = 0.5;
        }


    }

    update()
    {
        super.update();

        this.moveLeft();

        this.moveRight();

        this.rotate();

        this.changeDelay();


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

        ////try to clear the row
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
        this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
        this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);
        this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
        this.zKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.Z);
        this.xKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.X);

        //move timer for limiting move amount
        this.moveTimer = this.game.time.clock.createTimer('move', 0.1, 0);
        this.moveTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.resetControls, this);

        //board
        this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.borders, 0, 80));
        this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.board, 5, 85));
        this.board = new Board();

        //drop the first shape

        this.createNewShape();

        this.dropTimer = this.game.time.clock.createTimer('fall', 0.5, 0);
        this.dropTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.dropDown, this);
        this.dropTimer.start();


    }
}