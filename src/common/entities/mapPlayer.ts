"use strict";

export class MapPlayer {
    positionXOnMap: number;

    positionYOnMap: number;

    framesPerRow: number;

    constructor (initX: number, initY: number) {
        this.positionXOnMap = initX;
        this.positionYOnMap = initY;
        this.framesPerRow = 4;
    }
}