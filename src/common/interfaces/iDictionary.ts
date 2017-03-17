"use strict";

export interface IDictionary<T> {
    add(key: string, value: T): void;
    containsKey(key: string): boolean;
    count(): number;
    get(key: string): T;
    keys(): string[];
    remove(key: string): T;
    values(): T[];
}