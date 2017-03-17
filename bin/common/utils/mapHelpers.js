"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MapHelpers;
(function (MapHelpers) {
    class SplitSpriteRequest {
        constructor(spriteImage, splitStartXPoint, splitStartYPoint, splitAreaWidth, splitAreaHeight, splitTileWidth, splitTileHeight) {
            this.spriteImage = spriteImage;
            this.splitStartXPoint = splitStartXPoint;
            this.splitStartYPoint = splitStartYPoint;
            this.splitAreaHeight = splitAreaHeight;
            this.splitAreaWidth = splitAreaWidth;
            this.splitTileHeight = splitTileHeight;
            this.splitTileWidth = splitTileWidth;
        }
    }
    MapHelpers.SplitSpriteRequest = SplitSpriteRequest;
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
                    var tileImage = new Image();
                    tileImage.src = tileCanvas.toDataURL();
                    result.push(tileImage);
                }
            }
            return result;
        }
    }
    MapHelpers.SpriteManager = SpriteManager;
})(MapHelpers = exports.MapHelpers || (exports.MapHelpers = {}));
