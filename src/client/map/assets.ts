/// <reference path="../../_all.d.ts" />
"use strict";

import { IAsync, IDictionary } from "../../common/interfaces/_interfaces";
import { AssetConfig, Element} from "../../common/entities/_entities";
import { Dictionary, SplitSpriteRequest, SpriteManager } from "../../common/helpers/_helpers";

export module MapAssets {
    export class MapElements implements IAsync {
        private _config: AssetConfig;

        public elements: IDictionary<Element>;

        constructor() {
            this.elements = new Dictionary<Element>();
            this._config = new AssetConfig(require("../config/mapElementsConfig.json"));
        }

        load (): Promise<any> {
            var self = this;
            var promises = new Array<Promise<{}>>();

            self._config.sprites.forEach(configSprite => {
                var promise = new Promise((resolve, reject) => {
                    return SpriteManager
                        .loadSpriteAsync(configSprite.url)
                        .then(function (data: HTMLImageElement) {
                            configSprite.elements.forEach(configElement => {
                                var tiles = SpriteManager.splitSprite(
                                    new SplitSpriteRequest(data, configElement.sourceXPoint, configElement.sourceYPoint, configElement.sourceHeight, configElement.sourceWidth, configElement.destinationTileHeight, configElement.destinationTileWidth)
                                );

                                for (var x = 0; x < tiles.length; x++) {
                                    var el = new Element();
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
}