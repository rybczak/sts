/// <reference path="../../_all.d.ts" />
"use strict";

import * as express from "express";

module MainRoute {
    export class Route {
        public index(req: express.Request, res: express.Response, next: express.NextFunction) {
            res.render("index");
        }
    }
}

export = MainRoute;