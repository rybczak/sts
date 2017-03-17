"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const io = require("socket.io-client");
const r = require("./map/renderer");
class Client {
    constructor() {
        var self = this;
        self.socket = io.connect();
        self.socket.on("connect", function () {
            console.log("connecting");
        }.bind(this));
        self.socket.on("onconnected", function () {
            self.connected = true;
            console.log("connected");
        });
    }
}
exports.Client = Client;
var client = new Client();
var renderer = new r.MapRenderer.Renderer();
renderer.init(document.getElementById("canvas"));
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
