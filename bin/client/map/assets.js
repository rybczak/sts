"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _entities_1 = require("../../common/entities/_entities");
const _helpers_1 = require("../../common/helpers/_helpers");
var MapAssets;
(function (MapAssets) {
    class MapElements {
        constructor() {
            this.elements = new _helpers_1.Dictionary();
            this._config = new _entities_1.AssetConfig(require("../config/mapElementsConfig.json"));
        }
        load() {
            var self = this;
            var promises = new Array();
            self._config.sprites.forEach(configSprite => {
                var promise = new Promise((resolve, reject) => {
                    return _helpers_1.SpriteManager
                        .loadSpriteAsync(configSprite.url)
                        .then(function (data) {
                        configSprite.elements.forEach(configElement => {
                            var tiles = _helpers_1.SpriteManager.splitSprite(new _helpers_1.SplitSpriteRequest(data, configElement.sourceXPoint, configElement.sourceYPoint, configElement.sourceHeight, configElement.sourceWidth, configElement.destinationTileHeight, configElement.destinationTileWidth));
                            for (var x = 0; x < tiles.length; x++) {
                                var el = new _entities_1.Element();
                                el.name = configElement.name + x;
                                el.value = tiles[x];
                                self.elements.add(el.name, el);
                            }
                        });
                        resolve();
                    });
                });
                promises.push(promise);
            });
            return Promise.all(promises);
        }
    }
    MapAssets.MapElements = MapElements;
})(MapAssets = exports.MapAssets || (exports.MapAssets = {}));
