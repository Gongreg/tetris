/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../../lib/kiwi.d.ts" />
/// <reference path="shape.ts" />
var Tetris;
(function (Tetris) {
    var Shapes;
    (function (Shapes) {
        var ShapeStack = (function () {
            function ShapeStack(state) {
                //shape names
                this.shapes = [
                    'I',
                    'J',
                    'L',
                    'O',
                    'S',
                    'T',
                    'Z'
                ];
                //shapes array waiting to spawn
                this.shapeStack = [];
                this.state = state;
            }
            /**
             * @author http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
             */
            ShapeStack.shuffle = function (array) {
                var counter = array.length, temp, index;
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
            };
            ShapeStack.prototype.getNextShape = function (pop) {
                if (pop === void 0) { pop = false; }
                if (this.shapeStack.length < 2) {
                    var tempArray = this.shapes.slice(0);
                    tempArray.forEach(function (element, index) { return tempArray[index] = 'Shape' + element; });
                    this.shapeStack = this.shapeStack.concat(ShapeStack.shuffle(tempArray));
                }
                return pop ? this.shapeStack.shift() : this.shapeStack[0];
            };
            ShapeStack.prototype.createNewShape = function (addToGame, shapeName, x, y) {
                if (addToGame === void 0) { addToGame = false; }
                if (shapeName === void 0) { shapeName = ''; }
                if (x === void 0) { x = 4; }
                if (y === void 0) { y = 1; }
                if (shapeName.length == 0) {
                    shapeName = this.getNextShape(true);
                }
                var shape = new Shapes[shapeName](this.state, x, y);
                if (addToGame) {
                    this.state.addChild(shape.getGameObject());
                }
                return shape;
            };
            return ShapeStack;
        })();
        Shapes.ShapeStack = ShapeStack;
    })(Shapes = Tetris.Shapes || (Tetris.Shapes = {}));
})(Tetris || (Tetris = {}));
//# sourceMappingURL=shape-stack.js.map