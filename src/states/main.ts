/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../gameObjects/shape.ts" />
/// <reference path="../gameObjects/board.ts" />
/// <reference path="../enums.ts" />
/// <reference path="../config.ts" />

module Tetris {

    export class MainState extends Kiwi.State
    {

        private currentShape: Shapes.Shape;

        private fallTimer: Kiwi.Time.Timer;
        private moveTimer: Kiwi.Time.Timer;

        private leftKey: Kiwi.Input.Key;
        private rightKey: Kiwi.Input.Key;
        private downKey: Kiwi.Input.Key;
        private upKey: Kiwi.Input.Key;
        private zKey: Kiwi.Input.Key;
        private xKey: Kiwi.Input.Key;
        private spaceKey: Kiwi.Input.Key;

        //Moving to left and right
        private moving: boolean = false;

        //rotating
        private rotating: boolean = false;
        private rotationDirection: number = 0;

        //dropping
        private dropping: boolean = false;

        private board: Board;

        //block colors for sprite loading
        private blocks: string[] = [
            'blue',
            'cyan',
            'green',
            'orange',
            'purple',
            'red',
            'yellow'
        ];

        //block shapes for classes
        private shapes: string[] = [
            'I',
            'J',
            'L',
            'O',
            'S',
            'T',
            'Z'
        ];

        private shapeStack: string[] = [];

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

        moveControls()
        {

            var left: boolean = this.leftKey.isDown;
            var right: boolean = this.rightKey.isDown;

            var direction = right ? Direction.Right: Direction.Left;

            if ((left || right) && !this.moving && this.board.emptyDirection(this.currentShape.getBlocks(), direction)) {
                this.moving = true;

                this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Empty);
                this.currentShape.move(direction);
                this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

                this.moveTimer.start();

            }
        }

        resetMoving()
        {
            this.moving = false;
        }

        rotate(direction: number)
        {

            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.CurrentShape);

            var positions: PositionI[] = this.currentShape.getNextRotation(direction);
            var rotated: boolean = false;
            while (positions.length > 0) {

                if (this.board.emptyPositions(positions)) {
                    rotated = true;
                    this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Empty);
                    this.currentShape.rotate();
                    this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);
                    break;
                }

                if (rotated) {
                    break;
                }

                positions = this.currentShape.getNextRotation(direction);
            }

            this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

            return rotated;

        }

        //drop down event
        fallDown(amountOfTiles: number = 1, forceCheck: boolean = false)
        {
            //try to fall down
            //amount of Tiles specified must be empty, because here I don't check tiles below
            if (this.board.emptyDirection(this.currentShape.getBlocks(), Direction.Down)) {

                this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Empty);
                this.currentShape.fall(amountOfTiles);
                this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);
                if (!forceCheck) {
                    return;
                }

            }

            ////try to clear the rows in which blocks exist
            this.board.checkRows(this.currentShape.getBlocks());

            //create empty shape
            this.createEmptyShape();

            //if we can create shape add it into the game
            if (this.board.emptyPositions(this.currentShape.getPositions())) {

                this.board.setBlocks(this.currentShape.getBlocks(), BlockStatus.Taken);

                this.addChild(this.currentShape.getGameObject());

                return;
            }

            console.log('gg');
            //if unable to create new shape gg
        }

        rotationControls()
        {
            //rotation controls
            if (this.xKey.isDown) {
                this.rotationDirection = Direction.Right;
            } else if (this.zKey.isDown) {
                this.rotationDirection = Direction.Left;
            } else if (this.upKey.isDown) {
                this.rotationDirection = Direction.Up;
            }

            if (this.rotationDirection !== 0 && !this.rotating) {

                this.rotating = true;

                //try to rotate both to right and left
                if (this.rotationDirection == Direction.Up) {
                    if (!this.rotate(Direction.Right)) {
                        this.rotate(Direction.Left);
                    }
                } else {
                    this.rotate(this.rotationDirection);
                }

            }

            if ((this.rotationDirection == Direction.Left && this.zKey.isUp)
                || (this.rotationDirection == Direction.Right && this.xKey.isUp)
                || (this.rotationDirection == Direction.Up && this.upKey.isUp)
            ) {
                this.rotating = false;
                this.rotationDirection = 0;
            }

        }

        dropDownControls()
        {
            if (this.spaceKey.isDown && !this.dropping) {
                this.dropping = true;
                var amountOfTiles: number = this.board.findLowestPossible(this.currentShape.getBlocks());
                this.fallDown(amountOfTiles, true);

            }

            if (this.spaceKey.isUp && this.dropping) {
                this.dropping = false;
            }
        }

        fallTimerControls()
        {
            //delay if pressing down arrow
            this.fallTimer.delay = 0.5;
            if (this.downKey.isDown) {
                this.fallTimer.delay = 0.001;
            }
        }

        update()
        {
            super.update();

            this.moveControls();

            this.rotationControls();

            this.dropDownControls();

            this.fallTimerControls();


            //keep falling down
            this.fallTimer.start();

        }

        /**
         * @author http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
         */
        static shuffle(array: any[]) {
            var counter = array.length, temp, index;

            // While there are elements in the array
            while (counter > 0) {
                // Pick a random index
                index = Math.floor(Math.random() * counter);

                // Decrease counter by 1
                counter--;

                // And swap the last element with it
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }

            return array;
        }

        getFromShapeStack()
        {
            if (this.shapeStack.length == 0) {
                var tempArray: string[] = this.shapes.slice(0);
                for (var index in tempArray) {
                    tempArray[index] = 'Shape' + tempArray[index];
                }

                this.shapeStack = MainState.shuffle(tempArray);

            }

            return this.shapeStack.pop();
        }

        createEmptyShape(shapeName: string = '', x: number = 4, y: number = -1)
        {
            if (shapeName.length == 0) {
                shapeName = this.getFromShapeStack();
            }


            this.currentShape = new Shapes[shapeName](this, x, y);
        }

        createNewShape(shapeName: string = '', x: number = 4, y: number = -1)
        {

            if (shapeName.length == 0) {
                shapeName = this.getFromShapeStack();
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
            this.spaceKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);

            //move timer for limiting move amount
            this.moveTimer = this.game.time.clock.createTimer('move', 0.1, 0);
            this.moveTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.resetMoving, this);

            //board
            this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.borders, Config.offsetX, Config.offsetY));
            this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.board, Config.offsetX + Config.borderWidth, Config.offsetY + Config.borderWidth));
            this.board = new Board();

            //
            ////numbers on sides of board
            //for (var i: number = 0; i < 10; i++) {
            //    var blockNumber = new Kiwi.GameObjects.TextField(this, i.toString(), 45 +  29 * i, 30, "#000000", 30);
            //    this.addChild(blockNumber);
            //}
            //
            //for (var i: number = 0; i < 20; i++) {
            //    var blockNumber = new Kiwi.GameObjects.TextField(this, i.toString(), 0 , 80 + 29 * i, "#000000", 30);
            //    this.addChild(blockNumber);
            //}

            //drop the first shape
            this.createNewShape();

            //add drop timer
            this.fallTimer = this.game.time.clock.createTimer('fall', 0.5, 0);
            this.fallTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.fallDown, this);
            this.fallTimer.start();


        }
    }

}