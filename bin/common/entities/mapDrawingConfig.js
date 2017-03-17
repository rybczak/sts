"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MapDrawingConfig {
    constructor(data) {
        this.interval = data.fps / 1000;
        this.mapHeight = data.mapHeight;
        this.mapWidth = data.mapWidth;
        this.screenHeight = data.screenHeight;
        this.screenWidth = data.screenWidth;
        this.viewPortHeight = data.viewPortHeight;
        this.viewPortWidth = data.viewPortWidth;
        this.movementSize = data.movementSize;
        this.menuTileSize = data.menuTileSize;
    }
}
exports.MapDrawingConfig = MapDrawingConfig;
