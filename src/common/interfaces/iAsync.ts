"use strict";

export interface IAsync {
    load(): Promise<any>;
}