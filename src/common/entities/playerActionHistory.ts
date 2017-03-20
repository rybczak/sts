"use strict";

export class PlayerActionHistory {
    timestamp: number;

    sequence: string;

    actionName: string;

    actionValue: number;

    constructor(date: number, sequence: string, name: string, value: number) {
        this.timestamp = date;
        this.sequence = sequence;
        this.actionName = name;
        this.actionValue = value;
    }
}