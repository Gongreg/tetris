/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../gameObjects/shape.ts" />
/// <reference path="../gameObjects/board.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MainState = (function (_super) {
    __extends(MainState, _super);
    function MainState() {
        _super.apply(this, arguments);
        this.pressed = false;
        this.blocks = [
            'blue',
            'cyan',
            'green',
            'orange',
            'purple',
            'red',
            'yellow'
        ];
        this.shapes = [
            'I',
            'J',
            'L',
            'O',
            'S',
            'T',
            'Z'
        ];
    }
    MainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.addImage('board', 'assets/img/board.png');
        this.addImage('borders', 'assets/img/borders.png');
        for (var index in this.blocks) {
            var color = this.blocks[index];
            this.addImage('block-' + color, 'assets/img/block-' + color + '.png');
        }
    };
    MainState.prototype.update = function () {
        _super.prototype.update.call(this);
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
    };
    MainState.prototype.resetControls = function () {
        this.pressed = false;
    };
    //drop down event
    MainState.prototype.dropDown = function () {
        if (this.board.canFall(this.currentShape.getBlocks())) {
            this.board.setBlocks(this.currentShape.getBlocks(), false);
            this.currentShape.fall();
            this.board.setBlocks(this.currentShape.getBlocks(), true);
            return;
        }
        //if unable to create new shape gg
        this.createNewShape();
    };
    MainState.prototype.createNewShape = function () {
        var shapeName = Math.floor(Math.random() * 7);
        this.currentShape = new Shapes['Shape' + this.shapes[shapeName]](this, 3, 0);
        this.board.setBlocks(this.currentShape.getBlocks(), true);
        this.addChild(this.currentShape.getGameObject());
    };
    MainState.prototype.create = function () {
        _super.prototype.create.call(this);
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
    };
    return MainState;
})(Kiwi.State);
//# sourceMappingURL=main.js.map