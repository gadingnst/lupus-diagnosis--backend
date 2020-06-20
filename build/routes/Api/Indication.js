"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Indication_1 = __importDefault(require("app/Controllers/Indication"));
const Router_1 = __importDefault(require("routes/Router"));
class IndicationRoute extends Router_1.default {
    constructor() {
        super(Indication_1.default);
    }
    routes() {
        this.router.get('/', this.bindHandler(Indication_1.default.index));
        this.router.get('/:code', this.bindHandler(Indication_1.default.getByCode));
    }
}
exports.default = new IndicationRoute().router;
