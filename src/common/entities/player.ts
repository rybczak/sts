"use strict";

import { Direction } from "./enums";
import { PlayerData } from "./playerData";
import { PlayerActionHistory } from "./playerActionHistory";
import { IPlayerDataJson } from "../interfaces/_interfaces";

export class Player {
    private _movementSize: number;

    private _worldHeight: number;

    private _worldWidth: number;

    private _data: PlayerData;

    private _history: Array<PlayerActionHistory>;

    //previousPositionX: number;

    //previousPositionY: number;

    constructor(id: any, movemenetSize: number, worldHeight: number, worldWidth: number) {
        this._movementSize = movemenetSize;
        this._worldHeight = worldHeight;
        this._worldWidth = worldWidth;
        this._data = new PlayerData(id);
        this._history = new Array<PlayerActionHistory>();
    }

    getPlayerData(): IPlayerDataJson {
        var self = this;
        var result = this._data;
        var historyLen = self._history.length - 1;
        if (historyLen > 0) {
            var lastMove = self._history[historyLen];
            result.sequence = lastMove.sequence;
        }

        return result;
    }

    updatePlayerData(data: IPlayerDataJson) {
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

            //works only for one move
            for (var x = sequencePos + 1; x < self._history.length; x++) {
                var futureData = self._history[x];
                self.updatePosition(<Direction>futureData.actionValue);
            }
        }
    }

    //todo get config
    //move setting images to client renderer
    updatePosition(direction: Direction, date?: number, sequence?: string, ) {
        var self = this;

        switch (direction) {
            case Direction.Up:
                if (self._data.positionY - self._movementSize >= 0) {
                    self._data.positionY -= self._movementSize;
                }
                self._data.updateMovementSpriteInfo("BasicPlayer4", 4);
                break;
            case Direction.Down:
                if (self._data.positionY + self._movementSize < self._worldHeight) {
                    self._data.positionY += self._movementSize;
                }
                self._data.updateMovementSpriteInfo("BasicPlayer7", 4);
                break;
            case Direction.Left:
                if (self._data.positionX - self._movementSize >= 0) {
                    self._data.positionX -= self._movementSize;
                }
                self._data.updateMovementSpriteInfo("BasicPlayer9", 4);
                break;
            case Direction.Right:
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

    //remove this func when moving image seters to renderer
    resetPosition(direction: Direction) {
        var self = this;

        switch (direction) {
            case Direction.Up:
                self._data.updateMovementSpriteInfo("BasicPlayer5", 2);
                break;
            case Direction.Down:
                self._data.updateMovementSpriteInfo("BasicPlayer8", 2);
                break;
            case Direction.Left:
                self._data.updateMovementSpriteInfo("BasicPlayer9", 1);
                break;
            case Direction.Right:
                self._data.updateMovementSpriteInfo("BasicPlayer2", 1);
                break;
            default:
                console.log("Player :: Not supported move.");
                break;
        }
    }

    addHistoryEntry(date: number, sequence: string, name: string, value: number) {
        var self = this;
        self._history.push(new PlayerActionHistory(date, sequence, name, value));
    }
}
