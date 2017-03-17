"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MapDrawingConfig {
    constructor(data) {
        this.interval = data.fps / 1000;
        this.mapHeight = data.mapHeight;
        this.mapWidth = data.mapWidth;
        this.movementSize = data.movementSize;
        this.menuTileSize = data.menuTileSize;
    }
}
exports.MapDrawingConfig = MapDrawingConfig;
