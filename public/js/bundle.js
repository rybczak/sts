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

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var PlayerActionHistory = (function () {
    function PlayerActionHistory(date, sequence, name, value) {
        this.timestamp = date;
        this.sequence = sequence;
        this.actionName = name;
        this.actionValue = value;
    }
    return PlayerActionHistory;
}());
exports.PlayerActionHistory = PlayerActionHistory;


/***/ }),

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var PlayerData = (function () {
    function PlayerData(id) {
        this.id = id;
        this.name = "Player" + Math.floor(Math.random() * (99999 - 0 + 1)) + 0;
        this.positionX = 0;
        this.positionY = 0;
        this.currentImage = "BasicPlayer8";
        this.frameCounter = 2;
    }
    PlayerData.prototype.updateMovementSpriteInfo = function (spriteName, noImagesInSprite) {
        var self = this;
        self.currentImage = spriteName;
        self.frameCounter = noImagesInSprite;
    };
    return PlayerData;
}());
exports.PlayerData = PlayerData;


/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(__webpack_require__(39));
__export(__webpack_require__(42));
__export(__webpack_require__(41));
__export(__webpack_require__(13));
__export(__webpack_require__(38));
__export(__webpack_require__(40));
__export(__webpack_require__(15));
__export(__webpack_require__(14));


/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var io = __webpack_require__(12);
var r = __webpack_require__(36);
var _entities_1 = __webpack_require__(3);
var userController_1 = __webpack_require__(37);
var events_1 = __webpack_require__(71);
var Client = (function () {
    function Client() {
        this._messageSequence = 0;
        var self = this;
        self.player = new _entities_1.Player(0, 48, 3360, 3360);
        self.emitter = new events_1.EventEmitter();
        self.emitter.on("playerMove", function (data) {
            self.socket.emit("message", { id: self.player.getPlayerData().id, move: data.move, date: data.date, sequence: data.sequence });
        });
        self.controller = new userController_1.MapController.UserController(self.player, self.emitter);
        self.controller.registerArrowKeys();
        self.socket = io.connect();
        self.socket.on("connect", function () {
        }.bind(this));
        self.socket.on("onconnected", function (result) {
            self.player.updatePlayerData(result.player);
        });
        self.socket.on("update", function (result) {
            var currentPlayerIndex = -1;
            for (var x = 0; x < result.data.length; x++) {
                var player = result.data[x];
                if (player.id === self.player.getPlayerData().id) {
                    self.player.updatePlayerData(player);
                    currentPlayerIndex = x;
                }
            }
            result.data.splice(currentPlayerIndex, 1);
            self.otherPlayers = result.data;
            self.renderer.updateWorldInformation(self.otherPlayers);
        });
        self.renderer = new r.MapRenderer.Renderer(self.player, self.otherPlayers);
        self.renderer.init(document.getElementById("canvas"));
    }
    return Client;
}());
exports.Client = Client;
var client = new Client();


/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var _entities_1 = __webpack_require__(3);
var _helpers_1 = __webpack_require__(43);
var MapAssets;
(function (MapAssets) {
    var MapElements = (function () {
        function MapElements() {
            this.elements = new _helpers_1.Dictionary();
            this._config = new _entities_1.AssetConfig(__webpack_require__(87));
        }
        MapElements.prototype.load = function () {
            var self = this;
            var promises = new Array();
            self._config.sprites.forEach(function (configSprite) {
                console.log("Sprite " + configSprite.url + " starts");
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
                        console.log("Sprite " + configSprite.url + " ends");
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

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var assets_1 = __webpack_require__(35);
var _entities_1 = __webpack_require__(3);
var MapRenderer;
(function (MapRenderer) {
    var Renderer = (function () {
        function Renderer(player, otherPlayers) {
            this.counter = 0;
            this.currentFrame = 0;
            this._config = new _entities_1.MapDrawingConfig(__webpack_require__(86));
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
        Renderer.prototype.updateWorldInformation = function (info) {
            var self = this;
            self.otherPlayers = info;
        };
        ;
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
        Renderer.prototype.drawArea = function () {
            var self = this;
            if (self._initialized) {
                requestAnimationFrame(function () { return self.drawArea(); });
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
        Renderer.prototype.drawOtherCharacters = function () {
            var self = this;
            var playersData = self.otherPlayers;
            self.otherPlayersContext.clearRect(0, 0, self.otherPlayersCanvas.width, self.otherPlayersCanvas.height);
            if (playersData) {
                playersData.forEach(function (player) {
                    var frameSpeed = 10;
                    var frameEnd = player.frameCounter;
                    if (self.counter === (frameSpeed - 1)) {
                        self.currentFrame = (self.currentFrame + 1) % frameEnd;
                    }
                    self.counter = (self.counter + 1) % frameSpeed;
                    var row = 0;
                    var col = Math.floor(self.currentFrame % frameEnd);
                    self.otherPlayersContext.drawImage(self.elements.elements.get(player.currentImage).value, col * 96, row * 96, 96, 96, player.positionX, player.positionY, 96, 96);
                    var textWidth = self.playerContext.measureText(player.name).width;
                    self.otherPlayersContext.fillText(player.name, player.positionX + (48 - textWidth / 2), player.positionY + 10);
                });
            }
        };
        Renderer.prototype.drawCharacter = function () {
            var self = this;
            var playerData = this.player.getPlayerData();
            var frameSpeed = 10;
            var frameEnd = playerData.frameCounter;
            if (self.counter === (frameSpeed - 1)) {
                self.currentFrame = (self.currentFrame + 1) % frameEnd;
            }
            self.counter = (self.counter + 1) % frameSpeed;
            var row = 0;
            var col = Math.floor(self.currentFrame % frameEnd);
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
            self.playerContext.drawImage(self.elements.elements.get(playerData.currentImage).value, col * 96, row * 96, 96, 96, self.playerOnMap.positionXOnMap, self.playerOnMap.positionYOnMap, 96, 96);
            var textWidth = self.playerContext.measureText(playerData.name).width;
            self.playerContext.fillText(playerData.name, self.playerOnMap.positionXOnMap + (48 - textWidth / 2), self.playerOnMap.positionYOnMap + 10);
        };
        return Renderer;
    }());
    MapRenderer.Renderer = Renderer;
})(MapRenderer = exports.MapRenderer || (exports.MapRenderer = {}));


/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var _entities_1 = __webpack_require__(3);
var MapController;
(function (MapController) {
    var UserController = (function () {
        function UserController(player, emitter) {
            this._sequence = 0;
            this._player = player;
            this._emitter = emitter;
        }
        UserController.prototype.updatePlayerData = function (player) {
            var self = this;
            self._player = player;
        };
        UserController.prototype.registerArrowKeys = function () {
            var self = this;
            document.onkeydown = function (event) {
                var direction;
                var date = Date.now();
                var sequence = "seq" + self._sequence;
                switch (event.keyCode) {
                    case 38:
                        direction = _entities_1.Direction.Up;
                        self._player.updatePosition(direction, date, sequence);
                        event.preventDefault();
                        break;
                    case 40:
                        direction = _entities_1.Direction.Down;
                        self._player.updatePosition(direction, date, sequence);
                        event.preventDefault();
                        break;
                    case 37:
                        direction = _entities_1.Direction.Left;
                        self._player.updatePosition(direction, date, sequence);
                        event.preventDefault();
                        break;
                    case 39:
                        direction = _entities_1.Direction.Right;
                        self._player.updatePosition(direction, date, sequence);
                        event.preventDefault();
                        break;
                }
                self._emitter.emit("playerMove", { direction: direction, sequence: sequence, date: date, move: direction });
                self._sequence++;
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

/***/ 38:
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

/***/ 39:
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

/***/ 40:
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

/***/ 41:
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

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var enums_1 = __webpack_require__(13);
var playerData_1 = __webpack_require__(15);
var playerActionHistory_1 = __webpack_require__(14);
var Player = (function () {
    function Player(id, movemenetSize, worldHeight, worldWidth) {
        this._movementSize = movemenetSize;
        this._worldHeight = worldHeight;
        this._worldWidth = worldWidth;
        this._data = new playerData_1.PlayerData(id);
        this._history = new Array();
    }
    Player.prototype.getPlayerData = function () {
        var self = this;
        var result = this._data;
        var historyLen = self._history.length - 1;
        if (historyLen > 0) {
            var lastMove = self._history[historyLen];
            result.sequence = lastMove.sequence;
        }
        return result;
    };
    Player.prototype.updatePlayerData = function (data) {
        var self = this;
        self._data.id = data.id;
        self._data.positionX = data.positionX;
        self._data.positionY = data.positionY;
        if (data.sequence) {
            var sequencePos = -1;
            for (var x = 0; x < self._history.length; x++) {
                if (self._history[x].sequence === data.sequence) {
                    sequencePos = x;
                }
            }
            for (var x = sequencePos + 1; x < self._history.length; x++) {
                var futureData = self._history[x];
                self.updatePosition(futureData.actionValue);
            }
        }
    };
    Player.prototype.updatePosition = function (direction, date, sequence) {
        var self = this;
        switch (direction) {
            case enums_1.Direction.Up:
                if (self._data.positionY - self._movementSize >= 0) {
                    self._data.positionY -= self._movementSize;
                }
                self._data.updateMovementSpriteInfo("BasicPlayer4", 4);
                break;
            case enums_1.Direction.Down:
                if (self._data.positionY + self._movementSize < self._worldHeight) {
                    self._data.positionY += self._movementSize;
                }
                self._data.updateMovementSpriteInfo("BasicPlayer7", 4);
                break;
            case enums_1.Direction.Left:
                if (self._data.positionX - self._movementSize >= 0) {
                    self._data.positionX -= self._movementSize;
                }
                self._data.updateMovementSpriteInfo("BasicPlayer9", 4);
                break;
            case enums_1.Direction.Right:
                if (self._data.positionX + self._movementSize < self._worldWidth) {
                    self._data.positionX += self._movementSize;
                }
                self._data.updateMovementSpriteInfo("BasicPlayer1", 4);
                break;
            default:
                console.log("Player :: Not supported move.");
                break;
        }
        if (date) {
            self.addHistoryEntry(date, sequence, "move", direction);
        }
    };
    Player.prototype.resetPosition = function (direction) {
        var self = this;
        switch (direction) {
            case enums_1.Direction.Up:
                self._data.updateMovementSpriteInfo("BasicPlayer5", 2);
                break;
            case enums_1.Direction.Down:
                self._data.updateMovementSpriteInfo("BasicPlayer8", 2);
                break;
            case enums_1.Direction.Left:
                self._data.updateMovementSpriteInfo("BasicPlayer9", 1);
                break;
            case enums_1.Direction.Right:
                self._data.updateMovementSpriteInfo("BasicPlayer2", 1);
                break;
            default:
                console.log("Player :: Not supported move.");
                break;
        }
    };
    Player.prototype.addHistoryEntry = function (date, sequence, name, value) {
        var self = this;
        self._history.push(new playerActionHistory_1.PlayerActionHistory(date, sequence, name, value));
    };
    return Player;
}());
exports.Player = Player;


/***/ }),

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(__webpack_require__(44));
__export(__webpack_require__(46));
__export(__webpack_require__(45));


/***/ }),

/***/ 44:
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

/***/ 45:
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

/***/ 46:
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
                result.push(tileCanvas);
            }
        }
        return result;
    };
    return SpriteManager;
}());
exports.SpriteManager = SpriteManager;


/***/ }),

/***/ 71:
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),

/***/ 86:
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

/***/ 87:
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

/***/ 89:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(31);


/***/ })

},[89]);
//# sourceMappingURL=bundle.js.map