"use strict";
var ApiRoute;
(function (ApiRoute) {
    class Route {
        getProvinces(req, res, next) {
            res.json({ message: "GetProvinces api method" });
        }
    }
    ApiRoute.Route = Route;
})(ApiRoute || (ApiRoute = {}));
module.exports = ApiRoute;
