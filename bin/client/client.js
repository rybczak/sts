"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("socket.io-client");
const r = require("./map/renderer");
const _entities_1 = require("../common/entities/_entities");
const userController_1 = require("./map/userController");
const events_1 = require("events");
class Client {
    constructor() {
        this._messageSequence = 0;
        var self = this;
        self.player = new _entities_1.Player(0, 48, 3360, 3360);
        self.emitter = new events_1.EventEmitter();
        self.emitter.on("playerMove", function (data) {
            self.socket.emit("message", { id: self.player.getPlayerData().id, move: data.move, date: data.date, sequence: data.sequence });
        });
        self.controller = new userController_1.MapController.UserController(self.player, self.emitter);
        self.controller.registerArrowKeys();
        self.socket = io.connect();
        self.socket.on("connect", function () {
        }.bind(this));
        self.socket.on("onconnected", function (result) {
            self.player.updatePlayerData(result.player);
        });
        self.socket.on("update", function (result) {
            var currentPlayerIndex = -1;
            for (var x = 0; x < result.data.length; x++) {
                var player = result.data[x];
                if (player.id === self.player.getPlayerData().id) {
                    self.player.updatePlayerData(player);
                    currentPlayerIndex = x;
                }
            }
            result.data.splice(currentPlayerIndex, 1);
            self.otherPlayers = result.data;
            self.renderer.updateWorldInformation(self.otherPlayers);
        });
        self.renderer = new r.MapRenderer.Renderer(self.player, self.otherPlayers);
        self.renderer.init(document.getElementById("canvas"));
    }
}
exports.Client = Client;
var client = new Client();
