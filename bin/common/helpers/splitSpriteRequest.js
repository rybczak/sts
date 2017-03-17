"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SplitSpriteRequest {
    constructor(spriteImage, splitStartXPoint, splitStartYPoint, splitAreaHeight, splitAreaWidth, splitTileHeight, splitTileWidth) {
        this.spriteImage = spriteImage;
        this.splitStartXPoint = splitStartXPoint;
        this.splitStartYPoint = splitStartYPoint;
        this.splitAreaHeight = splitAreaHeight;
        this.splitAreaWidth = splitAreaWidth;
        this.splitTileHeight = splitTileHeight;
        this.splitTileWidth = splitTileWidth;
    }
}
exports.SplitSpriteRequest = SplitSpriteRequest;
