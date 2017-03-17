/// <reference path="../../_all.d.ts" />
"use strict";

import { Direction, Player } from "../../common/entities/_entities";

export module MapController {
    export class UserController {
        //todo add action configuration into json
        private _config: any;
        private _player: Player;

        constructor(player: Player) {
            this._player = player;
        }

        registerArrowKeys() {
            var self = this;

            document.onkeydown = function (event: KeyboardEvent) {
                switch (event.keyCode) {
                    case 38:
                        self._player.updatePosition(Direction.Up);
                        event.preventDefault();
                        break;
                    case 40:
                        self._player.updatePosition(Direction.Down);
                        event.preventDefault();
                        break;
                    case 37:
                        self._player.updatePosition(Direction.Left);
                        event.preventDefault();
                        break;
                    case 39:
                        self._player.updatePosition(Direction.Right);
                        event.preventDefault();
                        break;
                }
            };

            document.onkeyup = function (event: KeyboardEvent) {
                switch (event.keyCode) {
                    case 38:
                        self._player.resetPosition(Direction.Up);
                        event.preventDefault();
                        break;
                    case 40:
                        self._player.resetPosition(Direction.Down);
                        event.preventDefault();
                        break;
                    case 37:
                        self._player.resetPosition(Direction.Left);
                        event.preventDefault();
                        break;
                    case 39:
                        self._player.resetPosition(Direction.Right);
                        event.preventDefault();
                        break;
                }
            };
        }
    }
}