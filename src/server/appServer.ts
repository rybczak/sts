/// <reference path="../_all.d.ts" />
"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as mainRoute from "./routes/mainRoute";
import * as apiRoute from "./routes/apiRoute";
import * as ejs from "ejs";

export class Server {
    public app: express.Application;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    private config() {
        this.app.set("views", path.join(__dirname, "../../views"));
        this.app.engine("html", ejs.renderFile);
        this.app.set("view engine", "html");

        //mount logger
        //this.app.use(logger("dev"));

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, "../../public")));
        this.app.use(express.static(path.join(__dirname, "../../bower_components")));
        this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            var error = new Error("Not Found");
            err.status = 404;
            next(err);
        });
    }

    private routes() {
        let mainRouter: express.Router;
        mainRouter = express.Router();
        let apiRouter: express.Router;
        apiRouter = express.Router();

        var index: mainRoute.Route = new mainRoute.Route();
        mainRouter.get("/", index.index.bind(index.index));

        var api: apiRoute.Route = new apiRoute.Route();
        apiRouter.get("/GetProvinces", api.getProvinces.bind(api.getProvinces));

        this.app.use("/", mainRouter);
        this.app.use("/api", apiRouter);
    }
}