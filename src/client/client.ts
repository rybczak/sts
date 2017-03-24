/// <reference path="../_all.d.ts" />

import * as $ from "jquery";
import * as io from "socket.io-client";
import * as ma from "./map/assets";
import mapAssets = ma.MapAssets;
import * as entities from "../common/entities/_entities";
import * as r from "./map/renderer";
import { Player, PlayerData } from "../common/entities/_entities";
import { IPlayerDataJson } from "../common/interfaces/_interfaces";
import { MapController } from "./map/userController";
import { EventEmitter } from "events";

export class Client {
    private _messageSequence: number = 0;

    public socket: any;
    public connected: boolean;
    public player: Player;
    public otherPlayers: Array<PlayerData>;
    public renderer: r.MapRenderer.Renderer;
    public controller: MapController.UserController;
    public emitter: EventEmitter;

    constructor() {
        var self = this;

        self.player = new Player(0, 48, 3360, 3360);
        self.emitter = new EventEmitter();
        self.emitter.on("playerMove", function (data: any) {
            self.socket.emit("message", { id: self.player.getPlayerData().id, move: data.move, date: data.date, sequence: data.sequence });
            //console.log("Move: " + data.move);
        });
        self.controller = new MapController.UserController(self.player, self.emitter);
        self.controller.registerArrowKeys();

        self.socket = io.connect();
        self.socket.on("connect", function () {
            //console.log("connecting");
        }.bind(this));

        self.socket.on("onconnected", function (result: any) {
            self.player.updatePlayerData(result.player);
            $(".online-counter").text(result.online);
            //console.log("connected, ID: " + self.player.getPlayerData().id);
        });

        self.socket.on("update", function (result: any) {
            $(".online-counter").text(result.online);
            //add reconciliation, this is simple solution for start purposes
            var currentPlayerIndex = -1;
            for (var x = 0; x < result.data.length; x++) {
                var player = result.data[x];
                if (player.id === self.player.getPlayerData().id) {
                    self.player.updatePlayerData(player);
                    //console.log("Last processed sequence: " + player.sequence);
                    currentPlayerIndex = x;
                }
            }
            result.data.splice(currentPlayerIndex, 1);
            self.otherPlayers = result.data;

            self.renderer.updateWorldInformation(self.otherPlayers);
        });


        $(".chatbox-message").on("keyup", function (event: any) {
            if (event.keyCode === 13 && !event.shiftKey) {
                var message = $(".chatbox-message").val();

                $(".chatbox-message").val("");
                $(".chatbox-body")[0].innerHTML += "<div class=\"chatbox-body-message chatbox-body-message-left\">" +
                    "<img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg\" alt=\"Picture\"><p>" + message + "</p></div>";
                $(".chatbox-body").scrollTop($(".chatbox-body")[0].scrollHeight);

                self.socket.emit("chatMessage", { message: message, user: self.player.getPlayerData().name });
            }
        });

        self.socket.on("online", function (data: any) {
            $(".chatbox-body")[0].innerHTML += data.name + " jest online<br>";
            $(".chatbox-body").scrollTop($(".chatbox-body")[0].scrollHeight);
        });

        self.socket.on("offline", function (data: any) {
            $(".chatbox-body")[0].innerHTML += data.name + " jest offline<br>";
            $(".chatbox-body").scrollTop($(".chatbox-body")[0].scrollHeight);
        });

        self.socket.on("chatMessage", function (data: any) {
            $(".chatbox-body")[0].innerHTML += "<div class=\"chatbox-body-message chatbox-body-message-right\">" +
                "<img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/arashmil/128.jpg\" alt=\"Picture\"><p>" + data.message + "<br><span style=\"font-size:10px\">" + data.user + "</span></p></div>";
            $(".chatbox-body").scrollTop($(".chatbox-body")[0].scrollHeight);
        });

        self.renderer = new r.MapRenderer.Renderer(self.player, self.otherPlayers);
        self.renderer.init(<HTMLCanvasElement>document.getElementById("canvas"));
    }
}

var client = new Client();

$(document).ready(function () {
    var trigger = $(".hamburger"),
        overlay = $(".overlay"),
        isClosed = false;

    trigger.click(function () {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed === true) {
            overlay.hide();
            trigger.removeClass("is-open");
            trigger.addClass("is-closed");
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass("is-closed");
            trigger.addClass("is-open");
            isClosed = true;
        }
    }
});

$(document).ready(function () {
    $("[data-toggle=\"offcanvas\"]").click(function () {
        $("#wrapper").toggleClass("toggled");
    });

    $(".chatbox-title").on("click", function () {
        $(".chatbox").toggleClass("chatbox-tray");
    });

    $(".chatbox").on("transitionend", function () {
        if ($(".chatbox").hasClass("chatbox-closed")) { $(".chatbox").remove(); };
    });
});