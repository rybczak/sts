"use strict";

export class SplitSpriteRequest {
    spriteImage: HTMLImageElement;
    splitStartXPoint: number;
    splitStartYPoint: number;
    splitAreaHeight: number;
    splitAreaWidth: number;
    splitTileHeight: number;
    splitTileWidth: number;

    constructor(
        spriteImage: HTMLImageElement,
        splitStartXPoint: number,
        splitStartYPoint: number,
        splitAreaHeight: number,
        splitAreaWidth: number,
        splitTileHeight: number,
        splitTileWidth: number) {
        this.spriteImage = spriteImage;
        this.splitStartXPoint = splitStartXPoint;
        this.splitStartYPoint = splitStartYPoint;
        this.splitAreaHeight = splitAreaHeight;
        this.splitAreaWidth = splitAreaWidth;
        this.splitTileHeight = splitTileHeight;
        this.splitTileWidth = splitTileWidth;
    }
}