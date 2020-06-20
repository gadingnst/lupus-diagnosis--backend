"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class default_1 {
    constructor(binder) {
        this.router = express_1.Router();
        this.binder = binder;
        this.routes();
    }
    bindHandler(handler) {
        if (typeof this.binder !== 'object') {
            throw new Error(`If you want to use 'bindHandler' method, property 'binder' must be 'object' which has RequestHandler. Received: '${typeof this.binder}'`);
        }
        return handler.bind(this.binder);
    }
}
exports.default = default_1;
