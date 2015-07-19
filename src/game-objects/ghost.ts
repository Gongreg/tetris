/**
 * Created by Gytis on 2015-05-21.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="block.ts" />

module Tetris {

    export class Ghost {
        protected state: Kiwi.State;

        protected gameObject : Kiwi.Group;

        protected blocks: Block[] = [];

        constructor(state: Kiwi.State, positions: Position[], lowerBy: number) {
            this.state = state;
            this.gameObject = new Kiwi.Group(state);

            positions.forEach(position => {

                var block: Block = new Block(
                    position.x,
                    position.y + lowerBy,
                    this.state,
                    this.state.textures['block-ghost']
                );

                this.blocks.push(
                    block
                );

                this.gameObject.addChild(
                    block.sprite
                );
            });

        }

        public getGameObject() {
            return this.gameObject;
        }

        public setPosition(positions: Position[], lowerBy: number) {
            this.blocks.forEach((block, index) => {

                block.setPosition(positions[index].x, positions[index].y + lowerBy);
            });
        }
    }
}


