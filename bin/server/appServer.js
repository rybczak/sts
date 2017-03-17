"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const mainRoute = require("./routes/mainRoute");
const apiRoute = require("./routes/apiRoute");
const ejs = require("ejs");
class Server {
    static bootstrap() {
        return new Server();
    }
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        this.app.set("views", path.join(__dirname, "../../views"));
        this.app.engine("html", ejs.renderFile);
        this.app.set("view engine", "html");
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, "../../public")));
        this.app.use(express.static(path.join(__dirname, "../../bower_components")));
        this.app.use(function (err, req, res, next) {
            var error = new Error("Not Found");
            err.status = 404;
            next(err);
        });
    }
    routes() {
        let mainRouter;
        mainRouter = express.Router();
        let apiRouter;
        apiRouter = express.Router();
        var index = new mainRoute.Route();
        mainRouter.get("/", index.index.bind(index.index));
        var api = new apiRoute.Route();
        apiRouter.get("/GetProvinces", api.getProvinces.bind(api.getProvinces));
        this.app.use("/", mainRouter);
        this.app.use("/api", apiRouter);
    }
}
exports.Server = Server;
