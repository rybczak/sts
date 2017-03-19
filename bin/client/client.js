"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
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
        self.emitter.on("playerMove", function (move) {
            self.socket.emit("message", { id: self.player.getPlayerData().id, move: move });
            console.log(move);
        });
        self.controller = new userController_1.MapController.UserController(self.player, self.emitter);
        self.controller.registerArrowKeys();
        self.socket = io.connect();
        self.socket.on("connect", function () {
            console.log("connecting");
        }.bind(this));
        self.socket.on("onconnected", function (result) {
            self.player.updatePlayerData(result.player);
            console.log("connected, ID: " + self.player.getPlayerData().id);
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
$(".panel-actions-hide").on("click", function () {
    var el = $(".panel-actions-hide");
    if (el.hasClass("fa-minus")) {
        $(".panel-actions-hide").removeClass("fa-minus");
        $(".panel-actions-hide").addClass("fa-plus");
        $(".panel-heading-name").hide();
        $(".panel-body-actions").hide();
        $(".col-panel-actions").removeClass("col-lg-4");
        $(".col-panel-map").removeClass("col-lg-8");
        $(".col-panel-actions").addClass("col-lg-1");
        $(".col-panel-map").addClass("col-lg-11");
    }
    else {
        $(".panel-actions-hide").addClass("fa-minus");
        $(".panel-actions-hide").removeClass("fa-plus");
        $(".panel-heading-name").show();
        $(".panel-body-actions").show();
        $(".col-panel-actions").removeClass("col-lg-1");
        $(".col-panel-actions").addClass("col-lg-4");
        $(".col-panel-map").removeClass("col-lg-11");
        $(".col-panel-map").addClass("col-lg-8");
    }
});
