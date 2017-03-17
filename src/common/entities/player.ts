"use strict";

import { Direction } from "./enums";
//import { EventEmitter } from "events";

export class Player {
    private _movementSize: number;

    private _worldHeight: number;

    private _worldWidth: number;

    positionX: number = 0;

    positionY: number = 0;

    currentImage: string;

    frameCounter: number;

    //previousPositionX: number;

    //previousPositionY: number;

    //playerEmitter: EventEmitter;

    constructor(movemenetSize: number, worldHeight: number, worldWidth: number) {
        this._movementSize = movemenetSize;
        this._worldHeight = worldHeight;
        this._worldWidth = worldWidth;
        this.currentImage = "BasicPlayer8";
        this.frameCounter = 2;
    }

    //todo get config
    updatePosition(direction: Direction) {
        var self = this;
        //self.previousPositionX = self.positionX;
        //self.previousPositionY = self.positionY;

        switch (direction) {
            case Direction.Up:
                if (self.positionY - self._movementSize >= 0) {
                    self.positionY -= self._movementSize;
                }
                self.currentImage = "BasicPlayer4";
                self.frameCounter = 4;
                break;
            case Direction.Down:
                if (self.positionY + self._movementSize < self._worldHeight) {
                    self.positionY += self._movementSize;
                }
                self.currentImage = "BasicPlayer7";
                self.frameCounter = 4;
                break;
            case Direction.Left:
                if (self.positionX - self._movementSize >= 0) {
                    self.positionX -= self._movementSize;
                }
                self.currentImage = "BasicPlayer9";
                self.frameCounter = 4;
                break;
            case Direction.Right:
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

    resetPosition(direction: Direction) {
        var self = this;
        //self.previousPositionX = self.positionX;
        //self.previousPositionY = self.positionY;

        switch (direction) {
            case Direction.Up:
                self.currentImage = "BasicPlayer5";
                self.frameCounter = 2;
                break;
            case Direction.Down:
                self.currentImage = "BasicPlayer8";
                self.frameCounter = 2;
                break;
            case Direction.Left:
                self.currentImage = "BasicPlayer9";
                self.frameCounter = 1;
                break;
            case Direction.Right:
                self.currentImage = "BasicPlayer2";
                self.frameCounter = 1;
                break;
            default:
                console.log("Player :: Not supported move.");
                break;
        }
    }
}
