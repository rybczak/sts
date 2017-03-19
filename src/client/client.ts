/// <reference path="../_all.d.ts" />

import * as $ from "jquery";
import * as io from "socket.io-client";
import * as ma from "./map/assets";
import mapAssets = ma.MapAssets;
import * as entities from "../common/entities/_entities";
import * as r from "./map/renderer";
import { Player } from "../common/entities/_entities";
import { MapController } from "./map/userController";
import { EventEmitter } from "events";

export class Client {
    private _messageSequence: number = 0;

    public socket: any;
    public connected: boolean;
    public player: Player;
    public renderer: r.MapRenderer.Renderer;
    public controller: MapController.UserController;
    public emitter: EventEmitter;

    constructor() {
        var self = this;

        self.player = new Player(0, 48, 3360, 3360);
        self.emitter = new EventEmitter();
        self.emitter.on("playerMove", function (move: any) {
            self.socket.emit("message", { id: self.player.getPlayerData().id, move: move });
            console.log(move);
        });
        self.controller = new MapController.UserController(self.player, self.emitter);
        self.controller.registerArrowKeys();

        self.socket = io.connect();
        self.socket.on("connect", function () {
            console.log("connecting");
        }.bind(this));

        self.socket.on("onconnected", function (result: any) {
            self.player.updatePlayerData(result.player);
            console.log("connected, ID: " + self.player.getPlayerData().id);
        });

        self.socket.on("update", function (result: any) {
            //add reconciliation, this is simple solution for start purposes
            self.player.updatePlayerData(result.player);
            //self.renderer.updatePlayerData(self.player);
        });

        self.renderer = new r.MapRenderer.Renderer(self.player);
        self.renderer.init(<HTMLCanvasElement>document.getElementById("canvas"));
    }
}

var client = new Client();


//to refactor
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
    } else {
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