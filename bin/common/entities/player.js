"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
const playerData_1 = require("./playerData");
const playerActionHistory_1 = require("./playerActionHistory");
class Player {
    constructor(id, movemenetSize, worldHeight, worldWidth) {
        this._movementSize = movemenetSize;
        this._worldHeight = worldHeight;
        this._worldWidth = worldWidth;
        this._data = new playerData_1.PlayerData(id);
        this._history = new Array();
    }
    getPlayerData() {
        var self = this;
        var result = this._data;
        var historyLen = self._history.length - 1;
        if (historyLen > 0) {
            var lastMove = self._history[historyLen];
            result.sequence = lastMove.sequence;
        }
        return result;
    }
    updatePlayerData(data) {
        var self = this;
        self._data.id = data.id;
        self._data.positionX = data.positionX;
        self._data.positionY = data.positionY;
        if (data.sequence) {
            var sequencePos = -1;
            for (var x = 0; x < self._history.length; x++) {
                if (self._history[x].sequence === data.sequence) {
                    sequencePos = x;
                }
            }
            for (var x = sequencePos + 1; x < self._history.length; x++) {
                var futureData = self._history[x];
                self.updatePosition(futureData.actionValue);
            }
        }
    }
    updatePosition(direction, date, sequence) {
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
        if (date) {
            self.addHistoryEntry(date, sequence, "move", direction);
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
    addHistoryEntry(date, sequence, name, value) {
        var self = this;
        self._history.push(new playerActionHistory_1.PlayerActionHistory(date, sequence, name, value));
    }
}
exports.Player = Player;
