"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpriteManager {
    static loadSpriteAsync(urlPath) {
        return new Promise((resolve, reject) => {
            var sprite = new Image();
            sprite.onload = function () {
                resolve(this);
            };
            sprite.src = urlPath;
            return sprite;
        });
    }
    static splitSprite(request) {
        var result = new Array();
        var splitXEndPoint = request.splitStartXPoint + request.splitAreaWidth;
        var splitYEndPoint = request.splitStartYPoint + request.splitAreaHeight;
        for (var x = request.splitStartXPoint; x < splitXEndPoint; x += request.splitTileWidth) {
            for (var y = request.splitStartYPoint; y < splitYEndPoint; y += request.splitTileHeight) {
                var tileCanvas = document.createElement("canvas");
                tileCanvas.width = request.splitTileWidth;
                tileCanvas.height = request.splitTileHeight;
                var canvasContext = tileCanvas.getContext("2d");
                canvasContext.drawImage(request.spriteImage, x, y, request.splitTileWidth, request.splitTileHeight, 0, 0, request.splitTileWidth, request.splitTileHeight);
                result.push(tileCanvas);
            }
        }
        return result;
    }
}
exports.SpriteManager = SpriteManager;
