"use strict";

import { IPlayerDataJson } from "../interfaces/_interfaces";

export class PlayerData implements IPlayerDataJson {
    id: any;

    name: string;

    positionX: number;

    positionY: number;

    currentImage: string;

    frameCounter: number;

    sequence: string;

    constructor(id: any) {
        this.id = id;
        this.name = "Player" + Math.floor(Math.random() * (99999 - 0 + 1)) + 0;
        this.positionX = 0;
        this.positionY = 0;
        this.currentImage = "BasicPlayer8";
        this.frameCounter = 2;
    }

    updateMovementSpriteInfo(spriteName: string, noImagesInSprite: number) {
        var self = this;
        self.currentImage = spriteName;
        self.frameCounter = noImagesInSprite;
    }
}