"use strict";

import { IMapDrawingConfigJson }from "../interfaces/_interfaces";

export class MapDrawingConfig {
    interval: number;

    mapHeight: number;

    mapWidth: number;

    movementSize: number;

    menuTileSize: number;

    constructor (data: IMapDrawingConfigJson) {
        this.interval = data.fps / 1000;
        this.mapHeight = data.mapHeight;
        this.mapWidth = data.mapWidth;
        this.movementSize = data.movementSize;
        this.menuTileSize = data.menuTileSize;
    }
}