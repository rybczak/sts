/// <reference path="../_all.d.ts" />

import * as $ from "jquery";
import * as io from "socket.io-client";
import * as ma from "./map/assets";
import mapAssets = ma.MapAssets;
import * as entities from "../common/entities/_entities";
import * as r from "./map/renderer";

export class Client {
    public socket: any;
    public connected: boolean;

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

var client = new Client();
var renderer = new r.MapRenderer.Renderer();
renderer.init(<HTMLCanvasElement>document.getElementById("canvas"));

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