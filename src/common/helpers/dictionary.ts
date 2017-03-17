"use strict";

import { IDictionary } from "../interfaces/_interfaces";

export class Dictionary<T> implements IDictionary<T> {
    private _items: { [index: string]: T } = {};
    private _count: number = 0;

    public add (key: string, value: T) {
        this._items[key] = value;
        this._count++;
    }

    public containsKey (key: string): boolean {
        return this._items.hasOwnProperty(key);
    }

    public count (): number {
        return this._count;
    }

    public get (key: string): T {
        return this._items[key];
    }

    public keys (): string[] {
        var keySet: string[] = [];

        for (var prop in this._items) {
            if (this._items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }

        return keySet;
    }

    public remove (key: string): T {
        var value = this._items[key];
        delete this._items[key];
        this._count--;
        return value;
    }

    public values (): T[] {
        var values: T[] = [];

        for (var prop in this._items) {
            if (this._items.hasOwnProperty(prop)) {
                values.push(this._items[prop]);
            }
        }

        return values;
    }
}