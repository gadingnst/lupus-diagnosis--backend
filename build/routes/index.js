"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Http_1 = __importDefault(require("app/Helpers/Http"));
const configs_1 = require("configs");
const Router_1 = __importDefault(require("./Router"));
const Api_1 = __importDefault(require("./Api"));
class Routes extends Router_1.default {
    routes() {
        this.router.use('/api', Api_1.default);
        this.router.use(express_1.default.static(configs_1.PUBLIC_PATH));
        this.router.use('*', (req, res) => {
            Http_1.default.send(res, {
                code: 404,
                status: 'Not Found',
                message: 'Sorry, HTTP resource you are looking for was not found.',
                error: true
            });
        });
    }
}
exports.default = new Routes().router;
