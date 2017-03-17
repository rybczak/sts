webpackJsonp([0],{

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction = exports.Direction || (exports.Direction = {}));


/***/ }),

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var $ = __webpack_require__(1);
var io = __webpack_require__(12);
var r = __webpack_require__(34);
var Client = (function () {
    function Client() {
        var self = this;
        self.socket = io.connect();
        self.socket.on("connect", function () {
            console.log("connecting");
        }.bind(this));
        self.socket.on("onconnected", function () {
            self.connected = true;
            console.log("connected");
        });
    }
    return Client;
}());
exports.Client = Client;
var client = new Client();
var renderer = new r.MapRenderer.Renderer();
renderer.init(document.getElementById("canvas"));
$(".panel-actions-hide").on("click", function () {
    var el = $(".panel-actions-hide");
    if (el.hasClass("fa-minus")) {
        $(".panel-actions-hide").removeClass("fa-minus");
        $(".panel-actions-hide").addClass("fa-plus");
        $(".panel-heading-name").hide();
        $(".panel-body-actions").hide();
        $(".col-panel-actions").removeClass("col-lg-4");
        $(".col-panel-map").removeClass("col-lg-8");
        $(".col-panel-actions").addClass("col-lg-1");
        $(".col-panel-map").addClass("col-lg-11");
    }
    else {
        $(".panel-actions-hide").addClass("fa-minus");
        $(".panel-actions-hide").removeClass("fa-plus");
        $(".panel-heading-name").show();
        $(".panel-body-actions").show();
        $(".col-panel-actions").removeClass("col-lg-1");
        $(".col-panel-actions").addClass("col-lg-4");
        $(".col-panel-map").removeClass("col-lg-11");
        $(".col-panel-map").addClass("col-lg-8");
    }
});


/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var _entities_1 = __webpack_require__(6);
var _helpers_1 = __webpack_require__(41);
var MapAssets;
(function (MapAssets) {
    var MapElements = (function () {
        function MapElements() {
            this.elements = new _helpers_1.Dictionary();
            this._config = new _entities_1.AssetConfig(__webpack_require__(84));
        }
        MapElements.prototype.load = function () {
            var self = this;
            var promises = new Array();
            self._config.sprites.forEach(function (configSprite) {
                var promise = new Promise(function (resolve, reject) {
                    return _helpers_1.SpriteManager
                        .loadSpriteAsync(configSprite.url)
                        .then(function (data) {
                        configSprite.elements.forEach(function (configElement) {
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
        };
        return MapElements;
    }());
    MapAssets.MapElements = MapElements;
})(MapAssets = exports.MapAssets || (exports.MapAssets = {}));


/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var assets_1 = __webpack_require__(33);
var userController_1 = __webpack_require__(35);
var _entities_1 = __webpack_require__(6);
var MapRenderer;
(function (MapRenderer) {
    var Renderer = (function () {
        function Renderer() {
            this.counter = 0;
            this.currentFrame = 0;
            this._config = new _entities_1.MapDrawingConfig(__webpack_require__(83));
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
        Renderer.prototype.createCanvas = function (width, height) {
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            return canvas;
        };
        Renderer.prototype.init = function (canvas) {
            var self = this;
            self.screenCanvasContext = canvas.getContext("2d");
            self.elements = new assets_1.MapAssets.MapElements();
            Promise.all([self.elements.load()]).then(function () {
                self._initialized = true;
                self.drawWholeAreaMap();
                requestAnimationFrame(function () { return self.drawArea(); });
            });
        };
        Renderer.prototype.update = function () {
            var lint = "fuck you";
        };
        Renderer.prototype.drawArea = function () {
            var self = this;
            if (self._initialized) {
                requestAnimationFrame(function () { return self.drawArea(); });
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
        };
        Renderer.prototype.drawWholeAreaMap = function () {
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
        };
        ;
        Renderer.prototype.drawUserMap = function () {
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
        };
        Renderer.prototype.drawMenu = function () {
            var self = this;
            for (var x = self.viewPortCanvas.width; x < self.guiCanvas.width; x += self._config.menuTileSize) {
                for (var y = 0; y < self._config.mapHeight; y += self._config.menuTileSize) {
                    self.guiContext.drawImage(self.elements.elements.get("Background0").value, x, y);
                }
            }
        };
        Renderer.prototype.drawBorder = function () {
            var self = this;
            self.guiContext.drawImage(self.elements.elements.get("Border0").value, 0, 0);
        };
        Renderer.prototype.drawCharacter = function () {
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
        };
        return Renderer;
    }());
    MapRenderer.Renderer = Renderer;
})(MapRenderer = exports.MapRenderer || (exports.MapRenderer = {}));


/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var _entities_1 = __webpack_require__(6);
var MapController;
(function (MapController) {
    var UserController = (function () {
        function UserController(player) {
            this._player = player;
        }
        UserController.prototype.registerArrowKeys = function () {
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
        };
        return UserController;
    }());
    MapController.UserController = UserController;
})(MapController = exports.MapController || (exports.MapController = {}));


/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var AssetConfig = (function () {
    function AssetConfig(data) {
        this.sprites = data.sprites;
    }
    return AssetConfig;
}());
exports.AssetConfig = AssetConfig;
var ConfigSprite = (function () {
    function ConfigSprite() {
    }
    return ConfigSprite;
}());
var ConfigElement = (function () {
    function ConfigElement() {
    }
    return ConfigElement;
}());


/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Element = (function () {
    function Element() {
    }
    return Element;
}());
exports.Element = Element;


/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var MapDrawingConfig = (function () {
    function MapDrawingConfig(data) {
        this.interval = data.fps / 1000;
        this.mapHeight = data.mapHeight;
        this.mapWidth = data.mapWidth;
        this.screenHeight = data.screenHeight;
        this.screenWidth = data.screenWidth;
        this.viewPortHeight = data.viewPortHeight;
        this.viewPortWidth = data.viewPortWidth;
        this.movementSize = data.movementSize;
        this.menuTileSize = data.menuTileSize;
    }
    return MapDrawingConfig;
}());
exports.MapDrawingConfig = MapDrawingConfig;


/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var MapPlayer = (function () {
    function MapPlayer(initX, initY) {
        this.positionXOnMap = initX;
        this.positionYOnMap = initY;
        this.framesPerRow = 4;
    }
    return MapPlayer;
}());
exports.MapPlayer = MapPlayer;


/***/ }),

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var enums_1 = __webpack_require__(13);
var Player = (function () {
    function Player(movemenetSize, worldHeight, worldWidth) {
        this.positionX = 0;
        this.positionY = 0;
        this._movementSize = movemenetSize;
        this._worldHeight = worldHeight;
        this._worldWidth = worldWidth;
        this.currentImage = "BasicPlayer8";
        this.frameCounter = 2;
    }
    Player.prototype.updatePosition = function (direction) {
        var self = this;
        switch (direction) {
            case enums_1.Direction.Up:
                if (self.positionY - self._movementSize >= 0) {
                    self.positionY -= self._movementSize;
                }
                self.currentImage = "BasicPlayer4";
                self.frameCounter = 4;
                break;
            case enums_1.Direction.Down:
                if (self.positionY + self._movementSize < self._worldHeight) {
                    self.positionY += self._movementSize;
                }
                self.currentImage = "BasicPlayer7";
                self.frameCounter = 4;
                break;
            case enums_1.Direction.Left:
                if (self.positionX - self._movementSize >= 0) {
                    self.positionX -= self._movementSize;
                }
                self.currentImage = "BasicPlayer9";
                self.frameCounter = 4;
                break;
            case enums_1.Direction.Right:
                if (self.positionX + self._movementSize < self._worldWidth) {
                    self.positionX += self._movementSize;
                }
                self.currentImage = "BasicPlayer1";
                self.frameCounter = 4;
                break;
            default:
                console.log("Player :: Not supported move.");
                break;
        }
    };
    Player.prototype.resetPosition = function (direction) {
        var self = this;
        switch (direction) {
            case enums_1.Direction.Up:
                self.currentImage = "BasicPlayer5";
                self.frameCounter = 2;
                break;
            case enums_1.Direction.Down:
                self.currentImage = "BasicPlayer8";
                self.frameCounter = 2;
                break;
            case enums_1.Direction.Left:
                self.currentImage = "BasicPlayer9";
                self.frameCounter = 1;
                break;
            case enums_1.Direction.Right:
                self.currentImage = "BasicPlayer2";
                self.frameCounter = 1;
                break;
            default:
                console.log("Player :: Not supported move.");
                break;
        }
    };
    return Player;
}());
exports.Player = Player;


/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(__webpack_require__(42));
__export(__webpack_require__(44));
__export(__webpack_require__(43));


/***/ }),

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Dictionary = (function () {
    function Dictionary() {
        this._items = {};
        this._count = 0;
    }
    Dictionary.prototype.add = function (key, value) {
        this._items[key] = value;
        this._count++;
    };
    Dictionary.prototype.containsKey = function (key) {
        return this._items.hasOwnProperty(key);
    };
    Dictionary.prototype.count = function () {
        return this._count;
    };
    Dictionary.prototype.get = function (key) {
        return this._items[key];
    };
    Dictionary.prototype.keys = function () {
        var keySet = [];
        for (var prop in this._items) {
            if (this._items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
        return keySet;
    };
    Dictionary.prototype.remove = function (key) {
        var value = this._items[key];
        delete this._items[key];
        this._count--;
        return value;
    };
    Dictionary.prototype.values = function () {
        var values = [];
        for (var prop in this._items) {
            if (this._items.hasOwnProperty(prop)) {
                values.push(this._items[prop]);
            }
        }
        return values;
    };
    return Dictionary;
}());
exports.Dictionary = Dictionary;


/***/ }),

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var SplitSpriteRequest = (function () {
    function SplitSpriteRequest(spriteImage, splitStartXPoint, splitStartYPoint, splitAreaHeight, splitAreaWidth, splitTileHeight, splitTileWidth) {
        this.spriteImage = spriteImage;
        this.splitStartXPoint = splitStartXPoint;
        this.splitStartYPoint = splitStartYPoint;
        this.splitAreaHeight = splitAreaHeight;
        this.splitAreaWidth = splitAreaWidth;
        this.splitTileHeight = splitTileHeight;
        this.splitTileWidth = splitTileWidth;
    }
    return SplitSpriteRequest;
}());
exports.SplitSpriteRequest = SplitSpriteRequest;


/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var SpriteManager = (function () {
    function SpriteManager() {
    }
    SpriteManager.loadSpriteAsync = function (urlPath) {
        return new Promise(function (resolve, reject) {
            var sprite = new Image();
            sprite.onload = function () {
                resolve(this);
            };
            sprite.src = urlPath;
            return sprite;
        });
    };
    SpriteManager.splitSprite = function (request) {
        var result = new Array();
        var splitXEndPoint = request.splitStartXPoint + request.splitAreaWidth;
        var splitYEndPoint = request.splitStartYPoint + request.splitAreaHeight;
        for (var x = request.splitStartXPoint; x < splitXEndPoint; x += request.splitTileWidth) {
            for (var y = request.splitStartYPoint; y < splitYEndPoint; y += request.splitTileHeight) {
                var tileCanvas = document.createElement("canvas");
                tileCanvas.width = request.splitTileWidth;
                tileCanvas.height = request.splitTileHeight;
                var canvasContext = tileCanvas.getContext("2d");
                canvasContext.drawImage(request.spriteImage, x, y, request.splitTileWidth, request.splitTileHeight, 0, 0, request.splitTileWidth, request.splitTileHeight);
                var tileImage = new Image();
                tileImage.src = tileCanvas.toDataURL();
                result.push(tileImage);
            }
        }
        return result;
    };
    return SpriteManager;
}());
exports.SpriteManager = SpriteManager;


/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(__webpack_require__(37));
__export(__webpack_require__(40));
__export(__webpack_require__(39));
__export(__webpack_require__(13));
__export(__webpack_require__(36));
__export(__webpack_require__(38));


/***/ }),

/***/ 83:
/***/ (function(module, exports) {

module.exports = {
	"fps": 60,
	"mapHeight": 3360,
	"mapWidth": 3360,
	"screenHeight": 528,
	"screenWidth": 980,
	"viewPortHeight": 528,
	"viewPortWidth": 624,
	"movementSize": 48,
	"menuTileSize": 40
};

/***/ }),

/***/ 84:
/***/ (function(module, exports) {

module.exports = {
	"sprites": [
		{
			"url": "img/barsheet.png",
			"elements": [
				{
					"name": "Background",
					"sourceXPoint": 750,
					"sourceYPoint": 155,
					"sourceHeight": 40,
					"sourceWidth": 40,
					"destinationTileHeight": 40,
					"destinationTileWidth": 40
				},
				{
					"name": "Health",
					"sourceXPoint": 0,
					"sourceYPoint": 50,
					"sourceHeight": 302,
					"sourceWidth": 40,
					"destinationTileHeight": 302,
					"destinationTileWidth": 40
				}
			]
		},
		{
			"url": "img/clotharmor.png",
			"elements": [
				{
					"name": "BasicPlayer",
					"sourceXPoint": 0,
					"sourceYPoint": 0,
					"sourceHeight": 960,
					"sourceWidth": 480,
					"destinationTileHeight": 96,
					"destinationTileWidth": 480
				}
			]
		},
		{
			"url": "img/leatherarmor.png",
			"elements": [
				{
					"name": "ExtendedPlayer",
					"sourceXPoint": 0,
					"sourceYPoint": 0,
					"sourceHeight": 864,
					"sourceWidth": 480,
					"destinationTileHeight": 95,
					"destinationTileWidth": 95
				}
			]
		},
		{
			"url": "img/tilesheet.png",
			"elements": [
				{
					"name": "Grass",
					"sourceXPoint": 528,
					"sourceYPoint": 192,
					"sourceHeight": 288,
					"sourceWidth": 288,
					"destinationTileHeight": 48,
					"destinationTileWidth": 48
				},
				{
					"name": "Dirt",
					"sourceXPoint": 384,
					"sourceYPoint": 1152,
					"sourceHeight": 288,
					"sourceWidth": 288,
					"destinationTileHeight": 48,
					"destinationTileWidth": 48
				}
			]
		},
		{
			"url": "img/border.png",
			"elements": [
				{
					"name": "Border",
					"sourceXPoint": 0,
					"sourceYPoint": 0,
					"sourceHeight": 528,
					"sourceWidth": 980,
					"destinationTileHeight": 528,
					"destinationTileWidth": 980
				}
			]
		}
	]
};

/***/ }),

/***/ 86:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(29);


/***/ })

},[86]);
//# sourceMappingURL=bundle.js.map