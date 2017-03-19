"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assets_1 = require("./assets");
const _entities_1 = require("../../common/entities/_entities");
var MapRenderer;
(function (MapRenderer) {
    class Renderer {
        constructor(player, otherPlayers) {
            this.counter = 0;
            this.currentFrame = 0;
            this._config = new _entities_1.MapDrawingConfig(require("../config/mapDrawingConfig.json"));
            this.player = player;
            var playerData = this.player.getPlayerData();
            this.playerOnMap = new _entities_1.MapPlayer(playerData.positionX, playerData.positionY);
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
        updateWorldInformation(info) {
            var self = this;
            self.otherPlayers = info;
        }
        ;
        createCanvas(width, height) {
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            return canvas;
        }
        init(canvas) {
            var self = this;
            self.screenCanvasContext = canvas.getContext("2d");
            self.elements = new assets_1.MapAssets.MapElements();
            Promise.all([self.elements.load()]).then(function () {
                self._initialized = true;
                self.drawWholeAreaMap();
                requestAnimationFrame(() => self.drawArea());
            });
        }
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
                    self.drawOtherCharacters();
                    self.drawUserMap();
                    self.drawCharacter();
                    self.drawMenu();
                    self.drawBorder();
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
                    }
                    else {
                        self.wholeMapContext.drawImage(self.elements.elements.get("Dirt15").value, x, y);
                    }
                }
            }
        }
        ;
        drawUserMap() {
            var self = this;
            var playerData = this.player.getPlayerData();
            var srcXPoint = 0;
            if (playerData.positionX < self.viewPortCanvas.width / 2) {
                srcXPoint = 0;
            }
            else if (playerData.positionX > self.wholeMapCanvas.width - (self.viewPortCanvas.width / 2)) {
                srcXPoint = self.wholeMapCanvas.width - self.viewPortCanvas.width;
            }
            else {
                srcXPoint = playerData.positionX + (self._config.movementSize / 2) - (self.viewPortCanvas.width / 2);
            }
            var srcYPoint = 0;
            if (playerData.positionY < self.viewPortCanvas.height / 2) {
                srcYPoint = 0;
            }
            else if (playerData.positionY > self.wholeMapCanvas.width - (self.viewPortCanvas.height / 2)) {
                srcYPoint = self.wholeMapCanvas.width - self.viewPortCanvas.height;
            }
            else {
                srcYPoint = playerData.positionY + (self._config.movementSize / 2) - (self.viewPortCanvas.height / 2);
            }
            self.viewPortContext.clearRect(0, 0, self.viewPortCanvas.width, self.viewPortCanvas.height);
            self.viewPortContext.drawImage(self.wholeMapCanvas, srcXPoint, srcYPoint, self.viewPortCanvas.width, self.viewPortCanvas.height, 0, 0, self.viewPortCanvas.width, self.viewPortCanvas.height);
            self.viewPortContext.drawImage(self.otherPlayersCanvas, srcXPoint, srcYPoint, self.viewPortCanvas.width, self.viewPortCanvas.height, 0, 0, self.viewPortCanvas.width, self.viewPortCanvas.height);
        }
        drawMenu() {
            var self = this;
            for (var x = self.viewPortCanvas.width; x < self.guiCanvas.width; x += self._config.menuTileSize) {
                for (var y = 0; y < self._config.mapHeight; y += self._config.menuTileSize) {
                    self.guiContext.drawImage(self.elements.elements.get("Background0").value, x, y);
                }
            }
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
                playersData.forEach(function (player) {
                    self.otherPlayersContext.drawImage(self.elements.elements.get("BasicPlayer8").value, 0, 0, 96, 96, player.positionX, player.positionY);
                });
            }
        }
        drawCharacter() {
            var self = this;
            var playerData = this.player.getPlayerData();
            var frameSpeed = 10;
            var frameEnd = self.player.frameCounter;
            if (self.counter === (frameSpeed - 1)) {
                self.currentFrame = (self.currentFrame + 1) % frameEnd;
            }
            self.counter = (self.counter + 1) % frameSpeed;
            var row = Math.floor(self.currentFrame / 4);
            var col = Math.floor(self.currentFrame % 4);
            if (playerData.positionX < self.playerCanvas.width / 2) {
                this.playerOnMap.positionXOnMap = playerData.positionX;
            }
            else if (playerData.positionX > this.wholeMapCanvas.width - (self.playerCanvas.width / 2)) {
                this.playerOnMap.positionXOnMap = self.playerCanvas.width - (this.wholeMapCanvas.width - playerData.positionX);
            }
            else {
                this.playerOnMap.positionXOnMap = (this.playerCanvas.width / 2) - (self._config.movementSize / 2);
            }
            if (playerData.positionY < self.playerCanvas.height / 2) {
                this.playerOnMap.positionYOnMap = playerData.positionY;
            }
            else if (playerData.positionY > this.wholeMapCanvas.height - (self.playerCanvas.height / 2)) {
                this.playerOnMap.positionYOnMap = this.playerCanvas.height - (this.wholeMapCanvas.height - playerData.positionY);
            }
            else {
                this.playerOnMap.positionYOnMap = (this.playerCanvas.height / 2) - (self._config.movementSize / 2);
            }
            self.playerContext.clearRect(0, 0, self.playerCanvas.width, self.playerCanvas.height);
            self.playerContext.drawImage(self.elements.elements.get(self.player.currentImage).value, col * 96, row * 96, 96, 96, self.playerOnMap.positionXOnMap, self.playerOnMap.positionYOnMap, 96, 96);
        }
    }
    MapRenderer.Renderer = Renderer;
})(MapRenderer = exports.MapRenderer || (exports.MapRenderer = {}));
