/// <reference path="../_all.d.ts" />
"use strict";

import { Dictionary } from "../common/helpers/_helpers";
import { Direction, Player } from "../common/entities/_entities";
import { IPlayerDataJson } from "../common/interfaces/_interfaces";

export class GameServer {
    players: Dictionary<Player>;

    constructor() {
        this.players = new Dictionary<Player>();
    }

    addNewPlayer(userID: any): IPlayerDataJson {
        var self = this;

        var player = new Player(userID, 48, 3360, 3360);

        self.players.add(userID, player);

        return player.getPlayerData();
    }

    removePlayer(userID: any) {
        var self = this;

        self.players.remove(userID);
    }

    movePlayer(date: number, sequence: string, userID: any, userMove: Direction) {
        var self = this;
        var data = self.players.get(userID);

        data.updatePosition(userMove, date, sequence);
    }

    getData(): Array<IPlayerDataJson> {
        var self = this;
        var result = new Array<IPlayerDataJson>();
        var players = self.players.values();

        for (var x = 0; x < players.length; x++) {
            result.push(players[x].getPlayerData());
        }

        return result;
    }
}