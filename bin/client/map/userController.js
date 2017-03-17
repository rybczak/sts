"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _entities_1 = require("../../common/entities/_entities");
var MapController;
(function (MapController) {
    class UserController {
        constructor(player) {
            this._player = player;
        }
        registerArrowKeys() {
            var self = this;
            document.onkeydown = function (event) {
                switch (event.keyCode) {
                    case 38:
                        self._player.updatePosition(_entities_1.Direction.Up);
                        event.preventDefault();
                        break;
                    case 40:
                        self._player.updatePosition(_entities_1.Direction.Down);
                        event.preventDefault();
                        break;
                    case 37:
                        self._player.updatePosition(_entities_1.Direction.Left);
                        event.preventDefault();
                        break;
                    case 39:
                        self._player.updatePosition(_entities_1.Direction.Right);
                        event.preventDefault();
                        break;
                }
            };
            document.onkeyup = function (event) {
                switch (event.keyCode) {
                    case 38:
                        self._player.resetPosition(_entities_1.Direction.Up);
                        event.preventDefault();
                        break;
                    case 40:
                        self._player.resetPosition(_entities_1.Direction.Down);
                        event.preventDefault();
                        break;
                    case 37:
                        self._player.resetPosition(_entities_1.Direction.Left);
                        event.preventDefault();
                        break;
                    case 39:
                        self._player.resetPosition(_entities_1.Direction.Right);
                        event.preventDefault();
                        break;
                }
            };
        }
    }
    MapController.UserController = UserController;
})(MapController = exports.MapController || (exports.MapController = {}));
