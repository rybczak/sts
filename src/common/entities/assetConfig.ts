"use strict";

import { IAssetConfigJson }from "../interfaces/_interfaces";

export class AssetConfig {
    sprites: Array<ConfigSprite>;

    constructor (data: IAssetConfigJson) {
        this.sprites = data.sprites;
    }
}

class ConfigSprite {
    url: string;

    elements: Array<ConfigElement>;
}

class ConfigElement {
    name: string;

    sourceXPoint: number;

    sourceYPoint: number;

    sourceHeight: number;

    sourceWidth: number;

    destinationTileHeight: number;

    destinationTileWidth: number;
}