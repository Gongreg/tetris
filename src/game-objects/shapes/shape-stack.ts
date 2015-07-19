/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../../lib/kiwi.d.ts" />
/// <reference path="shape.ts" />

module Tetris {

    export module Shapes {
        export class ShapeStack {

            private state: Kiwi.State;

            //shape names
            private shapes: string[] = [
                'I',
                'J',
                'L',
                'O',
                'S',
                'T',
                'Z'
            ];


            //shapes array waiting to spawn
            private shapeStack: string[] = [];

            constructor(state) {
                this.state = state;
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


            getNextShape(pop = false)
            {
                if (this.shapeStack.length < 2) {
                    var tempArray: string[] = this.shapes.slice(0);
                    tempArray.forEach((element, index) => tempArray[index] = 'Shape' + element);

                    this.shapeStack = this.shapeStack.concat(ShapeStack.shuffle(tempArray));
                }

                return pop ? this.shapeStack.shift() : this.shapeStack[0];
            }

            createNewShape(addToGame: boolean = false, shapeName: string = '', x: number = 4, y: number = 1)
            {

                if (shapeName.length == 0) {
                    shapeName = this.getNextShape(true);
                }

                var shape = new Shapes[shapeName](this.state, x, y);

                if (addToGame) {
                    this.state.addChild(shape.getGameObject());
                }

                return shape;

            }
        }
    }
}
