/// <reference path="../../_all.d.ts" />
"use strict";

import { MapAssets } from "./assets";
import { MapDrawingConfig, MapPlayer, Player, PlayerData } from "../../common/entities/_entities";

export module MapRenderer {
    export class Renderer {
        private _initialized: boolean;
        private _previousDrawingTime: number;
        private _config: MapDrawingConfig;
        //private _controller: MapController.UserController;

        public elements: MapAssets.MapElements;

        //move it somewhere, dynamic canvases
        public viewPortCanvas: HTMLCanvasElement;
        public viewPortContext: CanvasRenderingContext2D;
        public guiCanvas: HTMLCanvasElement;
        public guiContext: CanvasRenderingContext2D;
        public playerCanvas: HTMLCanvasElement;
        public playerContext: CanvasRenderingContext2D;
        public otherPlayersCanvas: HTMLCanvasElement;
        public otherPlayersContext: CanvasRenderingContext2D;
        public wholeMapCanvas: HTMLCanvasElement;
        public wholeMapContext: CanvasRenderingContext2D;

        public screenCanvasContext: CanvasRenderingContext2D;

        //todo change to whole game data (abut map, player, other players)
        public player: Player;
        public otherPlayers: Array<PlayerData>;
        public playerOnMap: MapPlayer;

        constructor(player: Player, otherPlayers: Array<PlayerData>) {
            this._config = new MapDrawingConfig(require("../config/mapDrawingConfig.json"));
            this.player = player;
            var playerData = this.player.getPlayerData();
            this.playerOnMap = new MapPlayer(playerData.positionX, playerData.positionY);
            this.otherPlayers = otherPlayers;

            this.wholeMapCanvas = this.createCanvas(this._config.mapWidth, this._config.mapHeight);
            this.wholeMapContext = this.wholeMapCanvas.getContext("2d");

            this.otherPlayersCanvas = this.createCanvas(this._config.mapWidth, this._config.mapHeight);
            this.otherPlayersContext = this.otherPlayersCanvas.getContext("2d");

            this.viewPortCanvas = this.createCanvas(this._config.viewPortWidth, this._config.viewPortHeight);
            this.viewPortContext = this.viewPortCanvas.getContext("2d");

            this.guiCanvas = this.createCanvas(this._config.screenWidth, this._config.screenHeight);
            this.guiContext = this.guiCanvas.getContext("2d");

            this.playerCanvas = this.createCanvas(this._config.viewPortWidth, this._config.viewPortHeight);
            this.playerContext = this.playerCanvas.getContext("2d");
        }

        updateWorldInformation(info: Array<PlayerData>) {
            var self = this;
            self.otherPlayers = info;
        };

        createCanvas(width: number, height: number): HTMLCanvasElement {
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            return canvas;
        }

        init(canvas: HTMLCanvasElement) {
            var self = this;

            self.screenCanvasContext = canvas.getContext("2d");
            self.elements = new MapAssets.MapElements();

            Promise.all([self.elements.load()]).then(function () {
                self._initialized = true;

                self.drawWholeAreaMap();

                //virtual canvas to normal canvas


                requestAnimationFrame(() => self.drawArea());
            });
        }

        drawArea() {
            var self = this;

            if (self._initialized) {
                requestAnimationFrame(() => self.drawArea());

                var currentTime = Date.now();
                var timeDelta = currentTime - self._previousDrawingTime;
                self._previousDrawingTime = currentTime;

                if (timeDelta > self._config.interval) {
                    self.drawOtherCharacters();
                    self.drawUserMap();
                    self.drawCharacter();
                    self.drawMenu();
                    self.drawBorder();

                    //virtual canvas to normal canvas
                    self.screenCanvasContext.clearRect(0, 0, self._config.screenWidth, self._config.screenHeight);
                    self.screenCanvasContext.drawImage(self.viewPortCanvas, 0, 0);
                    self.screenCanvasContext.drawImage(self.playerCanvas, 0, 0);
                    self.screenCanvasContext.drawImage(self.guiCanvas, 0, 0);
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
            var playerData = this.player.getPlayerData();

            var srcXPoint = 0;
            if (playerData.positionX < self.viewPortCanvas.width / 2) {
                srcXPoint = 0;
            } else if (playerData.positionX > self.wholeMapCanvas.width - (self.viewPortCanvas.width / 2)) {
                srcXPoint = self.wholeMapCanvas.width - self.viewPortCanvas.width;
            } else {
                srcXPoint = playerData.positionX + (self._config.movementSize / 2) - (self.viewPortCanvas.width / 2);
            }

            var srcYPoint = 0;
            if (playerData.positionY < self.viewPortCanvas.height / 2) {
                srcYPoint = 0;
            } else if (playerData.positionY > self.wholeMapCanvas.width - (self.viewPortCanvas.height / 2)) {
                srcYPoint = self.wholeMapCanvas.width - self.viewPortCanvas.height;
            } else {
                srcYPoint = playerData.positionY + (self._config.movementSize / 2) - (self.viewPortCanvas.height / 2);
            }

            self.viewPortContext.clearRect(0, 0, self.viewPortCanvas.width, self.viewPortCanvas.height);
            self.viewPortContext.drawImage(self.wholeMapCanvas, srcXPoint, srcYPoint, self.viewPortCanvas.width, self.viewPortCanvas.height, 0, 0, self.viewPortCanvas.width, self.viewPortCanvas.height);
            self.viewPortContext.drawImage(self.otherPlayersCanvas, srcXPoint, srcYPoint, self.viewPortCanvas.width, self.viewPortCanvas.height, 0, 0, self.viewPortCanvas.width, self.viewPortCanvas.height);
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

        drawOtherCharacters() {
            var self = this;
            var playersData = self.otherPlayers;

            self.otherPlayersContext.clearRect(0, 0, self.otherPlayersCanvas.width, self.otherPlayersCanvas.height);
            if (playersData) {
                playersData.forEach(function (player: PlayerData) {
                    //animation
                    var frameSpeed = 10;
                    var frameEnd = player.frameCounter;

                    if (self.counter === (frameSpeed - 1)) {
                        self.currentFrame = (self.currentFrame + 1) % frameEnd;
                    }
                    self.counter = (self.counter + 1) % frameSpeed;

                    var row = 0;
                    var col = Math.floor(self.currentFrame % frameEnd);
                    //animation

                    self.otherPlayersContext.drawImage(self.elements.elements.get(player.currentImage).value, col * 96, row * 96, 96, 96, player.positionX, player.positionY, 96, 96);
                });
            }
        }

        counter: number = 0;
        currentFrame: number = 0;
        drawCharacter() {
            var self = this;
            var playerData = this.player.getPlayerData();

            //animation
            var frameSpeed = 10;
            var frameEnd = playerData.frameCounter;

            if (self.counter === (frameSpeed - 1)) {
                self.currentFrame = (self.currentFrame + 1) % frameEnd;
            }
            self.counter = (self.counter + 1) % frameSpeed;

            var row = 0;
            var col = Math.floor(self.currentFrame % frameEnd);
            //animation


            if (playerData.positionX < self.playerCanvas.width / 2) {
                this.playerOnMap.positionXOnMap = playerData.positionX;
            } else if (playerData.positionX > this.wholeMapCanvas.width - (self.playerCanvas.width / 2)) {
                this.playerOnMap.positionXOnMap = self.playerCanvas.width - (this.wholeMapCanvas.width - playerData.positionX);
            } else {
                this.playerOnMap.positionXOnMap = (this.playerCanvas.width / 2) - (self._config.movementSize / 2);
            }

            if (playerData.positionY < self.playerCanvas.height / 2) {
                this.playerOnMap.positionYOnMap = playerData.positionY;
            } else if (playerData.positionY > this.wholeMapCanvas.height - (self.playerCanvas.height / 2)) {
                this.playerOnMap.positionYOnMap = this.playerCanvas.height - (this.wholeMapCanvas.height - playerData.positionY);
            } else {
                this.playerOnMap.positionYOnMap = (this.playerCanvas.height / 2) - (self._config.movementSize / 2);
            }

            self.playerContext.clearRect(0, 0, self.playerCanvas.width, self.playerCanvas.height);
            self.playerContext.drawImage(
                self.elements.elements.get(playerData.currentImage).value,
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