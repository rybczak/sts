"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
class Player {
    constructor(movemenetSize, worldHeight, worldWidth) {
        this.positionX = 0;
        this.positionY = 0;
        this._movementSize = movemenetSize;
        this._worldHeight = worldHeight;
        this._worldWidth = worldWidth;
        this.currentImage = "BasicPlayer8";
        this.frameCounter = 2;
    }
    updatePosition(direction) {
        var self = this;
        switch (direction) {
            case enums_1.Direction.Up:
                if (self.positionY - self._movementSize >= 0) {
                    self.positionY -= self._movementSize;
                }
                self.currentImage = "BasicPlayer4";
                self.frameCounter = 4;
                break;
            case enums_1.Direction.Down:
                if (self.positionY + self._movementSize < self._worldHeight) {
                    self.positionY += self._movementSize;
                }
                self.currentImage = "BasicPlayer7";
                self.frameCounter = 4;
                break;
            case enums_1.Direction.Left:
                if (self.positionX - self._movementSize >= 0) {
                    self.positionX -= self._movementSize;
                }
                self.currentImage = "BasicPlayer9";
                self.frameCounter = 4;
                break;
            case enums_1.Direction.Right:
                if (self.positionX + self._movementSize < self._worldWidth) {
                    self.positionX += self._movementSize;
                }
                self.currentImage = "BasicPlayer1";
                self.frameCounter = 4;
                break;
            default:
                console.log("Player :: Not supported move.");
                break;
        }
    }
    resetPosition(direction) {
        var self = this;
        switch (direction) {
            case enums_1.Direction.Up:
                self.currentImage = "BasicPlayer5";
                self.frameCounter = 2;
                self.mirrorEdge = false;
                break;
            case enums_1.Direction.Down:
                self.currentImage = "BasicPlayer8";
                self.frameCounter = 2;
                break;
            case enums_1.Direction.Left:
                self.currentImage = "BasicPlayer9";
                self.frameCounter = 1;
                break;
            case enums_1.Direction.Right:
                self.currentImage = "BasicPlayer2";
                self.frameCounter = 1;
                break;
            default:
                console.log("Player :: Not supported move.");
                break;
        }
    }
}
exports.Player = Player;
