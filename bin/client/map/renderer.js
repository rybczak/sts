"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assets_1 = require("./assets");
const userController_1 = require("./userController");
const _entities_1 = require("../../common/entities/_entities");
var MapRenderer;
(function (MapRenderer) {
    class Renderer {
        constructor() {
            this.counter = 0;
            this.currentFrame = 0;
            this._config = new _entities_1.MapDrawingConfig(require("../config/mapDrawingConfig.json"));
            this.player = new _entities_1.Player(this._config.movementSize, this._config.mapHeight, this._config.mapWidth);
            this.playerOnMap = new _entities_1.MapPlayer(this.player.positionX, this.player.positionY);
            this.wholeMapCanvas = this.createCanvas(this._config.mapWidth, this._config.mapHeight);
            this.wholeMapContext = this.wholeMapCanvas.getContext("2d");
            this.viewPortCanvas = this.createCanvas(this._config.viewPortWidth, this._config.viewPortHeight);
            this.viewPortContext = this.viewPortCanvas.getContext("2d");
            this.guiCanvas = this.createCanvas(this._config.screenWidth, this._config.screenHeight);
            this.guiContext = this.guiCanvas.getContext("2d");
            this.playerCanvas = this.createCanvas(this._config.viewPortWidth, this._config.viewPortHeight);
            this.playerContext = this.playerCanvas.getContext("2d");
            new userController_1.MapController.UserController(this.player).registerArrowKeys();
        }
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
            var srcXPoint = 0;
            if (self.player.positionX < self.viewPortCanvas.width / 2) {
                srcXPoint = 0;
            }
            else if (self.player.positionX > self.wholeMapCanvas.width - (self.viewPortCanvas.width / 2)) {
                srcXPoint = self.wholeMapCanvas.width - self.viewPortCanvas.width;
            }
            else {
                srcXPoint = self.player.positionX + (self._config.movementSize / 2) - (self.viewPortCanvas.width / 2);
            }
            var srcYPoint = 0;
            if (self.player.positionY < self.viewPortCanvas.height / 2) {
                srcYPoint = 0;
            }
            else if (self.player.positionY > self.wholeMapCanvas.width - (self.viewPortCanvas.height / 2)) {
                srcYPoint = self.wholeMapCanvas.width - self.viewPortCanvas.height;
            }
            else {
                srcYPoint = self.player.positionY + (self._config.movementSize / 2) - (self.viewPortCanvas.height / 2);
            }
            self.viewPortContext.clearRect(0, 0, self.viewPortCanvas.width, self.viewPortCanvas.height);
            self.viewPortContext.drawImage(self.wholeMapCanvas, srcXPoint, srcYPoint, self.viewPortCanvas.width, self.viewPortCanvas.height, 0, 0, self.viewPortCanvas.width, self.viewPortCanvas.height);
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
        drawCharacter() {
            var self = this;
            var frameSpeed = 10;
            var frameEnd = self.player.frameCounter;
            if (self.counter === (frameSpeed - 1)) {
                self.currentFrame = (self.currentFrame + 1) % frameEnd;
            }
            self.counter = (self.counter + 1) % frameSpeed;
            var row = Math.floor(self.currentFrame / 4);
            var col = Math.floor(self.currentFrame % 4);
            if (this.player.positionX < self.playerCanvas.width / 2) {
                this.playerOnMap.positionXOnMap = this.player.positionX;
            }
            else if (this.player.positionX > this.wholeMapCanvas.width - (self.playerCanvas.width / 2)) {
                this.playerOnMap.positionXOnMap = self.playerCanvas.width - (this.wholeMapCanvas.width - this.player.positionX);
            }
            else {
                this.playerOnMap.positionXOnMap = (this.playerCanvas.width / 2) - (self._config.movementSize / 2);
            }
            if (this.player.positionY < self.playerCanvas.height / 2) {
                this.playerOnMap.positionYOnMap = this.player.positionY;
            }
            else if (this.player.positionY > this.wholeMapCanvas.height - (self.playerCanvas.height / 2)) {
                this.playerOnMap.positionYOnMap = this.playerCanvas.height - (this.wholeMapCanvas.height - this.player.positionY);
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
