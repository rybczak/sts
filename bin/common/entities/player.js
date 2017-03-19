"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
const playerData_1 = require("./playerData");
class Player {
    constructor(id, movemenetSize, worldHeight, worldWidth) {
        this._movementSize = movemenetSize;
        this._worldHeight = worldHeight;
        this._worldWidth = worldWidth;
        this._data = new playerData_1.PlayerData(id);
    }
    getPlayerData() {
        var self = this;
        return this._data;
    }
    updatePlayerData(data) {
        this._data.id = data.id;
        this._data.positionX = data.positionX;
        this._data.positionY = data.positionY;
    }
    updatePosition(direction) {
        var self = this;
        switch (direction) {
            case enums_1.Direction.Up:
                if (self._data.positionY - self._movementSize >= 0) {
                    self._data.positionY -= self._movementSize;
                }
                self._data.updateMovementSpriteInfo("BasicPlayer4", 4);
                break;
            case enums_1.Direction.Down:
                if (self._data.positionY + self._movementSize < self._worldHeight) {
                    self._data.positionY += self._movementSize;
                }
                self._data.updateMovementSpriteInfo("BasicPlayer7", 4);
                break;
            case enums_1.Direction.Left:
                if (self._data.positionX - self._movementSize >= 0) {
                    self._data.positionX -= self._movementSize;
                }
                self._data.updateMovementSpriteInfo("BasicPlayer9", 4);
                break;
            case enums_1.Direction.Right:
                if (self._data.positionX + self._movementSize < self._worldWidth) {
                    self._data.positionX += self._movementSize;
                }
                self._data.updateMovementSpriteInfo("BasicPlayer1", 4);
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
                self._data.updateMovementSpriteInfo("BasicPlayer5", 2);
                break;
            case enums_1.Direction.Down:
                self._data.updateMovementSpriteInfo("BasicPlayer8", 2);
                break;
            case enums_1.Direction.Left:
                self._data.updateMovementSpriteInfo("BasicPlayer9", 1);
                break;
            case enums_1.Direction.Right:
                self._data.updateMovementSpriteInfo("BasicPlayer2", 1);
                break;
            default:
                console.log("Player :: Not supported move.");
                break;
        }
    }
}
exports.Player = Player;
