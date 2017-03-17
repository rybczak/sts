"use strict";
var MainRoute;
(function (MainRoute) {
    class Route {
        index(req, res, next) {
            res.render("index");
        }
    }
    MainRoute.Route = Route;
})(MainRoute || (MainRoute = {}));
module.exports = MainRoute;
