"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mp = require("../utils/mapHelpers");
var mapHelpers = mp.MapHelpers;
const ch = require("../utils/commonHelpers");
var helpers = ch.CommonHelpers;
const e = require("./entities");
var entities = e.MapEntities;
var MapElements;
(function (MapElements) {
    class TerainElements {
        constructor() {
            this.spriteUrl = "img/tilesheet.png";
            this.grassElements = new helpers.Dictionary();
            this.dirtElements = new helpers.Dictionary();
        }
        load() {
            var self = this;
            var loadGrassPromise = new Promise((resolve, reject) => {
                return mapHelpers.SpriteManager
                    .loadSpriteAsync(self.spriteUrl)
                    .then(function (data) {
                    var result = mapHelpers.SpriteManager.splitSprite(new mapHelpers.SplitSpriteRequest(data, 528, 192, 288, 288, 48, 48));
                    for (var x = 0; x < result.length; x++) {
                        var el = new entities.Element();
                        el.name = "Grass" + x;
                        el.value = result[x];
                        self.grassElements.add(el.name, el);
                    }
                    resolve();
                });
            });
            var loadDirtPromise = new Promise((resolve, reject) => {
                return mapHelpers.SpriteManager
                    .loadSpriteAsync(self.spriteUrl)
                    .then(function (data) {
                    var result = mapHelpers.SpriteManager.splitSprite(new mapHelpers.SplitSpriteRequest(data, 384, 1152, 288, 288, 48, 48));
                    for (var x = 0; x < result.length; x++) {
                        var el = new entities.Element();
                        el.name = "Dirt" + x;
                        el.value = result[x];
                        self.grassElements.add(el.name, el);
                    }
                    resolve();
                });
            });
            return Promise.all([loadGrassPromise, loadDirtPromise]);
        }
    }
    MapElements.TerainElements = TerainElements;
})(MapElements = exports.MapElements || (exports.MapElements = {}));
