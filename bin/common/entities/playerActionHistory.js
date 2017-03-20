"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerActionHistory {
    constructor(date, sequence, name, value) {
        this.timestamp = date;
        this.sequence = sequence;
        this.actionName = name;
        this.actionValue = value;
    }
}
exports.PlayerActionHistory = PlayerActionHistory;
