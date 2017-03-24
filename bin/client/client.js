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
            $(".online-counter").text(result.online);
        });
        self.socket.on("update", function (result) {
            $(".online-counter").text(result.online);
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
        $(".chatbox-message").on("keyup", function (event) {
            if (event.keyCode === 13 && !event.shiftKey) {
                var message = $(".chatbox-message").val();
                $(".chatbox-message").val("");
                $(".chatbox-body")[0].innerHTML += "<div class=\"chatbox-body-message chatbox-body-message-left\">" +
                    "<img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg\" alt=\"Picture\"><p>" + message + "</p></div>";
                $(".chatbox-body").scrollTop($(".chatbox-body")[0].scrollHeight);
                self.socket.emit("chatMessage", { message: message, user: self.player.getPlayerData().name });
            }
        });
        self.socket.on("online", function (data) {
            $(".chatbox-body")[0].innerHTML += data.name + " jest online<br>";
            $(".chatbox-body").scrollTop($(".chatbox-body")[0].scrollHeight);
        });
        self.socket.on("offline", function (data) {
            $(".chatbox-body")[0].innerHTML += data.name + " jest offline<br>";
            $(".chatbox-body").scrollTop($(".chatbox-body")[0].scrollHeight);
        });
        self.socket.on("chatMessage", function (data) {
            $(".chatbox-body")[0].innerHTML += "<div class=\"chatbox-body-message chatbox-body-message-right\">" +
                "<img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/arashmil/128.jpg\" alt=\"Picture\"><p>" + data.message + "<br><span style=\"font-size:10px\">" + data.user + "</span></p></div>";
            $(".chatbox-body").scrollTop($(".chatbox-body")[0].scrollHeight);
        });
        self.renderer = new r.MapRenderer.Renderer(self.player, self.otherPlayers);
        self.renderer.init(document.getElementById("canvas"));
    }
}
exports.Client = Client;
var client = new Client();
$(document).ready(function () {
    var trigger = $(".hamburger"), overlay = $(".overlay"), isClosed = false;
    trigger.click(function () {
        hamburger_cross();
    });
    function hamburger_cross() {
        if (isClosed === true) {
            overlay.hide();
            trigger.removeClass("is-open");
            trigger.addClass("is-closed");
            isClosed = false;
        }
        else {
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
        if ($(".chatbox").hasClass("chatbox-closed")) {
            $(".chatbox").remove();
        }
        ;
    });
});
