"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerData {
    constructor(id) {
        this.id = id;
        this.positionX = 0;
        this.positionY = 0;
        this.currentImage = "BasicPlayer8";
        this.frameCounter = 2;
    }
    updateMovementSpriteInfo(spriteName, noImagesInSprite) {
        var self = this;
        self.currentImage = spriteName;
        self.frameCounter = noImagesInSprite;
    }
}
exports.PlayerData = PlayerData;
