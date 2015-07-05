module Tetris {
    export class Config {
        static borderWidth: number = 4;
        static offsetY: number = 0;
        static offsetX: number = 40;
        static tileSize: number = 30;
        static boardWidth: number = 10;
        static boardWidthInPixels: number = Config.offsetX + Config.borderWidth * 2 + Config.boardWidth * Config.tileSize;
        static boardHeight: number = 20;
    }
}
