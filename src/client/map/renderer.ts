/// <reference path="../../_all.d.ts" />
"use strict";

import { MapAssets } from "./assets";
import { MapController } from "./userController";
import { MapDrawingConfig, MapPlayer, Player } from "../../common/entities/_entities";

export module MapRenderer {
    export class Renderer {
        private _initialized: boolean;
        private _previousDrawingTime: number;
        private _config: MapDrawingConfig;

        public elements: MapAssets.MapElements;
        public viewPortCanvas: HTMLCanvasElement;
        public viewPortContext: CanvasRenderingContext2D;
        public guiCanvas: HTMLCanvasElement;
        public guiContext: CanvasRenderingContext2D;
        public playerCanvas: HTMLCanvasElement;
        public playerContext: CanvasRenderingContext2D;
        public wholeMapCanvas: HTMLCanvasElement;
        public wholeMapContext: CanvasRenderingContext2D;

        //todo change to whole game data (abut map, player, other players)
        public player: Player;
        public playerOnMap: MapPlayer;

        constructor() {
            this._config = new MapDrawingConfig(require("../config/mapDrawingConfig.json"));
            this.player = new Player(this._config.movementSize, this._config.mapHeight, this._config.mapWidth);
            this.playerOnMap = new MapPlayer(this.player.positionX, this.player.positionY);

            this.wholeMapCanvas = document.createElement("canvas");
            this.wholeMapCanvas.width = this._config.mapWidth;
            this.wholeMapCanvas.height = this._config.mapHeight;
            this.wholeMapContext = this.wholeMapCanvas.getContext("2d");

            new MapController.UserController(this.player).registerArrowKeys();
        }

        init(viewPortCanvas: HTMLCanvasElement, guiCanvas: HTMLCanvasElement, playerCanvas: HTMLCanvasElement) {
            var self = this;
            self.viewPortCanvas = viewPortCanvas;
            self.viewPortContext = self.viewPortCanvas.getContext("2d");
            self.guiCanvas = guiCanvas;
            self.guiContext = self.guiCanvas.getContext("2d");
            self.playerCanvas = playerCanvas;
            self.playerContext = self.playerCanvas.getContext("2d");
            self.elements = new MapAssets.MapElements();

            Promise.all([self.elements.load()]).then(function () {
                self._initialized = true;

                self.drawMenu();
                self.drawBorder();
                self.drawWholeAreaMap();

                requestAnimationFrame(() => self.drawArea());
            });
        }

        //todo update data to render (after server update to get fresh valid data on screen)
        update() {
            var lint = "fuck you";
        }

        drawArea() {
            var self = this;

            if (self._initialized) {
                requestAnimationFrame(() => self.drawArea());

                var currentTime = Date.now();
                var timeDelta = currentTime - self._previousDrawingTime;
                self._previousDrawingTime = currentTime;

                if (timeDelta > self._config.interval) {
                    self.drawUserMap();
                    self.drawCharacter();
                }
            }
        }

        drawWholeAreaMap() {
            var self = this;

            for (var x = 0; x < self.wholeMapCanvas.width; x += self._config.movementSize) {
                for (var y = 0; y < self.wholeMapCanvas.height; y += self._config.movementSize) {
                    if (Math.round(Math.random()) === 0) {
                        self.wholeMapContext.drawImage(self.elements.elements.get("Grass9").value, x, y);
                    } else {
                        self.wholeMapContext.drawImage(self.elements.elements.get("Dirt15").value, x, y);
                    }
                }
            }
        };

        drawUserMap() {
            var self = this;

            var srcXPoint = 0;
            if (self.player.positionX < self.viewPortCanvas.width / 2) {
                srcXPoint = 0;
            } else if (self.player.positionX > self.wholeMapCanvas.width - (self.viewPortCanvas.width / 2)) {
                srcXPoint = self.wholeMapCanvas.width - self.viewPortCanvas.width;
            } else {
                srcXPoint = self.player.positionX + (self._config.movementSize / 2) - (self.viewPortCanvas.width / 2);
            }

            var srcYPoint = 0;
            if (self.player.positionY < self.viewPortCanvas.height / 2) {
                srcYPoint = 0;
            } else if (self.player.positionY > self.wholeMapCanvas.width - (self.viewPortCanvas.height / 2)) {
                srcYPoint = self.wholeMapCanvas.width - self.viewPortCanvas.height;
            } else {
                srcYPoint = self.player.positionY + (self._config.movementSize / 2) - (self.viewPortCanvas.height / 2);
            }

            self.viewPortContext.clearRect(0, 0, self.viewPortCanvas.width, self.viewPortCanvas.height);
            self.viewPortContext.drawImage(self.wholeMapCanvas, srcXPoint, srcYPoint, self.viewPortCanvas.width, self.viewPortCanvas.height, 0, 0, self.viewPortCanvas.width, self.viewPortCanvas.height);
        }

        drawMenu() {
            //TODO get whole menu configuration drawing from json
            var self = this;

            for (var x = self.viewPortCanvas.width; x < self.guiCanvas.width; x += self._config.menuTileSize) {
                for (var y = 0; y < self._config.mapHeight; y += self._config.menuTileSize) {
                    self.guiContext.drawImage(self.elements.elements.get("Background0").value, x, y);
                }
            }

            //self.context.drawImage(self.elements.elements.get("Health0").value, 659, 10);
        }

        drawBorder() {
            var self = this;

            self.guiContext.drawImage(self.elements.elements.get("Border0").value, 0, 0);
        }

        counter: number = 0;
        currentFrame: number = 0;
        drawCharacter() {
            var self = this;

            //animation
            var frameSpeed = 10;
            var frameEnd = self.player.frameCounter;

            if (self.counter === (frameSpeed - 1)) {
                self.currentFrame = (self.currentFrame + 1) % frameEnd;
            }
            self.counter = (self.counter + 1) % frameSpeed;

            var row = Math.floor(self.currentFrame / 4);
            var col = Math.floor(self.currentFrame % 4);
            //animation


            if (this.player.positionX < self.playerCanvas.width / 2) {
                this.playerOnMap.positionXOnMap = this.player.positionX;
            } else if (this.player.positionX > this.wholeMapCanvas.width - (self.playerCanvas.width / 2)) {
                this.playerOnMap.positionXOnMap = self.playerCanvas.width - (this.wholeMapCanvas.width - this.player.positionX);
            } else {
                this.playerOnMap.positionXOnMap = (this.playerCanvas.width / 2) - (self._config.movementSize / 2);
            }

            if (this.player.positionY < self.playerCanvas.height / 2) {
                this.playerOnMap.positionYOnMap = this.player.positionY;
            } else if (this.player.positionY > this.wholeMapCanvas.height - (self.playerCanvas.height / 2)) {
                this.playerOnMap.positionYOnMap = this.playerCanvas.height - (this.wholeMapCanvas.height - this.player.positionY);
            } else {
                this.playerOnMap.positionYOnMap = (this.playerCanvas.height / 2) - (self._config.movementSize / 2);
            }

            self.playerContext.clearRect(0, 0, self.playerCanvas.width, self.playerCanvas.height);
            self.playerContext.drawImage(
                self.elements.elements.get(self.player.currentImage).value,
                col * 96, row * 96,
                96, 96,
                self.playerOnMap.positionXOnMap, self.playerOnMap.positionYOnMap,
                96, 96);

            // if (self.player.mirrorEdge) {
            //     self.playerContext.scale(-1, 1);
            // } else {
            //     self.playerContext.scale(0, 0);
            // }
        }
    }
}