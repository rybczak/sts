"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapHelpers = require("../utils/mapHelpers");
const commonHelpers = require("../utils/commonHelpers");
const entities = require("./entities");
var MapElements;
(function (MapElements) {
    class GuiElements {
        constructor() {
            this.basicSpriteUrl = "img/barsheet.png";
            this.menu = new commonHelpers.CommonHelpers.Dictionary();
        }
        load() {
            var self = this;
            var loadMenuBackgroundPromise = new Promise((resolve, reject) => {
                return mapHelpers.MapHelpers.SpriteManager
                    .loadSpriteAsync(self.basicSpriteUrl)
                    .then(function (data) {
                    var result = mapHelpers.MapHelpers.SpriteManager.splitSprite(new mapHelpers.MapHelpers.SplitSpriteRequest(data, 750, 155, 40, 40, 40, 40));
                    for (var x = 0; x < result.length; x++) {
                        var el = new entities.MapEntities.Element();
                        el.name = "Background";
                        el.value = result[x];
                        self.menu.add(el.name, el);
                    }
                    resolve();
                });
            });
            var loadHealthIndicatorPromise = new Promise((resolve, reject) => {
                return mapHelpers.MapHelpers.SpriteManager
                    .loadSpriteAsync(self.basicSpriteUrl)
                    .then(function (data) {
                    var result = mapHelpers.MapHelpers.SpriteManager.splitSprite(new mapHelpers.MapHelpers.SplitSpriteRequest(data, 0, 50, 302, 40, 302, 40));
                    for (var x = 0; x < result.length; x++) {
                        var el = new entities.MapEntities.Element();
                        el.name = "Health";
                        el.value = result[x];
                        self.menu.add(el.name, el);
                    }
                    resolve();
                });
            });
            return Promise.all([loadMenuBackgroundPromise, loadHealthIndicatorPromise]);
        }
    }
    MapElements.GuiElements = GuiElements;
})(MapElements = exports.MapElements || (exports.MapElements = {}));
