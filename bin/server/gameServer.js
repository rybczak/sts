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
    getData() {
        var self = this;
        var result = new Array();
        var players = self.players.values();
        for (var x = 0; x < players.length; x++) {
            result.push(players[x].getPlayerData());
        }
        return result;
    }
}
exports.GameServer = GameServer;
