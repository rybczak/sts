/// <reference path="../../_all.d.ts" />
"use strict";

import { SplitSpriteRequest } from "./splitSpriteRequest";

export class SpriteManager {
    static loadSpriteAsync (urlPath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            var sprite: HTMLImageElement = new Image();

            sprite.onload = function () {
                resolve(this);
            };

            sprite.src = urlPath;

            return sprite;
        });
    }

    static splitSprite (request: SplitSpriteRequest): Array<HTMLImageElement> {
        var result: Array<HTMLImageElement> = new Array<HTMLImageElement>();

        var splitXEndPoint = request.splitStartXPoint + request.splitAreaWidth;
        var splitYEndPoint = request.splitStartYPoint + request.splitAreaHeight;

        for (var x = request.splitStartXPoint; x < splitXEndPoint; x += request.splitTileWidth) {
            for (var y = request.splitStartYPoint; y < splitYEndPoint; y += request.splitTileHeight) {
                var tileCanvas: HTMLCanvasElement = document.createElement("canvas");
                tileCanvas.width = request.splitTileWidth;
                tileCanvas.height = request.splitTileHeight;

                var canvasContext: CanvasRenderingContext2D = tileCanvas.getContext("2d");

                canvasContext.drawImage(request.spriteImage, x, y, request.splitTileWidth, request.splitTileHeight, 0, 0, request.splitTileWidth, request.splitTileHeight);

                var tileImage: HTMLImageElement = new Image();
                tileImage.src = tileCanvas.toDataURL();
                result.push(tileImage);
            }
        }

        return result;
    }
}