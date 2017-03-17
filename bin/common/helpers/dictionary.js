"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Dictionary {
    constructor() {
        this._items = {};
        this._count = 0;
    }
    add(key, value) {
        this._items[key] = value;
        this._count++;
    }
    containsKey(key) {
        return this._items.hasOwnProperty(key);
    }
    count() {
        return this._count;
    }
    get(key) {
        return this._items[key];
    }
    keys() {
        var keySet = [];
        for (var prop in this._items) {
            if (this._items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
        return keySet;
    }
    remove(key) {
        var value = this._items[key];
        delete this._items[key];
        this._count--;
        return value;
    }
    values() {
        var values = [];
        for (var prop in this._items) {
            if (this._items.hasOwnProperty(prop)) {
                values.push(this._items[prop]);
            }
        }
        return values;
    }
}
exports.Dictionary = Dictionary;
