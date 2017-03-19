"use strict";

import { IPlayerDataJson } from "../interfaces/_interfaces";

export class PlayerData implements IPlayerDataJson {
    id: any;

    positionX: number;

    positionY: number;

    constructor (id: any) {
        this.id = id;
        this.positionX = 0;
        this.positionY = 0;
    }
}