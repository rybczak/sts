"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _helpers_1 = require("../common/helpers/_helpers");
const _entities_1 = require("../common/entities/_entities");
class GameServer {
    constructor() {
        this.players = new _helpers_1.Dictionary();
    }
    addNewPlayer(userID) {
        var self = this;
        var player = new _entities_1.Player(userID, 48, 3360, 3360);
        self.players.add(userID, player);
        return player.getPlayerData();
    }
    removePlayer(userID) {
        var self = this;
        self.players.remove(userID);
    }
    movePlayer(userID, userMove) {
        var self = this;
        var data = self.players.get(userID);
        data.updatePosition(userMove);
    }
    getPlayer(userID) {
        var self = this;
        var data = self.players.get(userID) != null ? self.players.get(userID).getPlayerData() : null;
        return data;
    }
}
exports.GameServer = GameServer;
