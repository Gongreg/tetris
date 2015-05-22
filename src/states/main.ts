/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../gameObjects/shapeI.ts" />
/// <reference path="../gameObjects/board.ts" />

class MainState extends Kiwi.State
{

    private currentShape: Shape;

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

    preload()
    {
        super.preload();
        this.addImage('board', 'assets/img/board.png');
        this.addImage('borders', 'assets/img/borders.png');

        for (var index in this.blocks) {
            var color : string = this.blocks[index];
            this.addImage('block'+ color, 'assets/img/block-'+ color +'.png');
        }

    }

    update()
    {
        super.update();

        if (this.leftKey.isDown && this.board.canMove(this.currentShape, -1, 0) && !this.pressed) {
            this.currentShape.move(-1);
            this.pressed = true;
            this.moveTimer.start();

        }

        if (this.rightKey.isDown && this.board.canMove(this.currentShape, 1, 0) && !this.pressed) {
            this.currentShape.move(1);
            this.pressed = true;
            this.moveTimer.start();

        }

        this.dropTimer.start();
    }

    allowMove()
    {
        this.pressed = false;
    }

    dropDown()
    {
        if (this.board.canMove(this.currentShape, 0, 1)) {
            this.currentShape.fall();
            return;
        }

        this.currentShape = new ShapeI(this, 0, 0);

        this.addChild(this.currentShape.getGameObject());

    }

    create()
    {
        super.create();

        this.board = new Board();

        //controls
        this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
        this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
        this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);

        this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.borders, 0, 0));
        this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.board, 5, 5));

        this.currentShape = new ShapeI(this, 0, 0);

        this.addChild(this.currentShape.getGameObject());

        this.dropTimer = this.game.time.clock.createTimer('fall', 0.5, 0);

        this.dropTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.dropDown, this);
        this.dropTimer.start();

        this.moveTimer = this.game.time.clock.createTimer('move', 0.1, 0);
        this.moveTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.allowMove, this);

    }
}