/// <reference path="../../_all.d.ts" />
"use strict";

import { Direction, Player } from "../../common/entities/_entities";
import { EventEmitter } from "events";

export module MapController {
    export class UserController {
        //todo add action configuration into json
        private _config: any;
        private _player: Player;
        private _emitter: EventEmitter;

        constructor(player: Player, emitter: EventEmitter) {
            this._player = player;
            this._emitter = emitter;
        }

        updatePlayerData(player: Player) {
            var self = this;
            self._player = player;
        }

        registerArrowKeys() {
            var self = this;

            document.onkeydown = function (event: KeyboardEvent) {
                var direction: Direction;

                switch (event.keyCode) {
                    case 38:
                        direction = Direction.Up;
                        self._player.updatePosition(direction);
                        event.preventDefault();
                        break;
                    case 40:
                        direction = Direction.Down;
                        self._player.updatePosition(direction);
                        event.preventDefault();
                        break;
                    case 37:
                        direction = Direction.Left;
                        self._player.updatePosition(direction);
                        event.preventDefault();
                        break;
                    case 39:
                        direction = Direction.Right;
                        self._player.updatePosition(direction);
                        event.preventDefault();
                        break;
                }

                self._emitter.emit("playerMove", direction);
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