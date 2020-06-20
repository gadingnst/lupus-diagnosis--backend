"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Http {
    static send(res, data) {
        return res.status(data.code).send(Object.assign(Object.assign({}, data), { error: false }));
    }
}
exports.default = Http;
