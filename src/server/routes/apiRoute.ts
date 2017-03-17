/// <reference path="../../_all.d.ts" />
"use strict";

import * as express from "express";

module ApiRoute {
    export class Route {
        public getProvinces(req: express.Request, res: express.Response, next: express.NextFunction) {
            res.json({message: "GetProvinces api method"});
        }
    }

}

export = ApiRoute;