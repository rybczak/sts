"use strict";

import { Direction } from "./enums";
import { PlayerData } from "./playerData";
import { IPlayerDataJson } from "../interfaces/_interfaces";

export class Player {
    private _movementSize: number;

    private _worldHeight: number;

    private _worldWidth: number;

    private _data: PlayerData;

    //previousPositionX: number;

    //previousPositionY: number;

    //playerEmitter: EventEmitter;

    constructor(id: any, movemenetSize: number, worldHeight: number, worldWidth: number) {
        this._movementSize = movemenetSize;
        this._worldHeight = worldHeight;
        this._worldWidth = worldWidth;
        this._data = new PlayerData(id);
        // this.playerEmitter = new EventEmitter();
    }

    getPlayerData(): IPlayerDataJson {
        var self = this;
        return this._data;
    }

    updatePlayerData(data: IPlayerDataJson) {
        this._data.id = data.id;
        this._data.positionX = data.positionX;
        this._data.positionY = data.positionY;
    }

    //todo get config
    //get this functions to new place
    updatePosition(direction: Direction) {
        var self = this;
        //self.previousPositionX = self.positionX;
        //self.previousPositionY = self.positionY;

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
    }

    resetPosition(direction: Direction) {
        var self = this;
        //self.previousPositionX = self.positionX;
        //self.previousPositionY = self.positionY;

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
}
