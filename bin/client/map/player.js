"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapHelpers = require("../utils/mapHelpers");
const commonHelpers = require("../utils/commonHelpers");
const entities = require("./entities");
var MapElements;
(function (MapElements) {
    class PlayerElements {
        constructor() {
            this.basicSpriteUrl = "img/clotharmor.png";
            this.basicPlayer = new commonHelpers.CommonHelpers.Dictionary();
        }
        load() {
            var self = this;
            var loadBasicPlayerPromise = new Promise((resolve, reject) => {
                return mapHelpers.MapHelpers.SpriteManager
                    .loadSpriteAsync(self.basicSpriteUrl)
                    .then(function (data) {
                    var result = mapHelpers.MapHelpers.SpriteManager.splitSprite(new mapHelpers.MapHelpers.SplitSpriteRequest(data, 0, 0, data.width, data.height, 95, 95));
                    for (var x = 0; x < result.length; x++) {
                        var el = new entities.MapEntities.Element();
                        el.name = "BasicPlayer" + x;
                        el.value = result[x];
                        self.basicPlayer.add(el.name, el);
                    }
                    resolve();
                });
            });
            return Promise.all([loadBasicPlayerPromise]);
        }
    }
    MapElements.PlayerElements = PlayerElements;
})(MapElements = exports.MapElements || (exports.MapElements = {}));
