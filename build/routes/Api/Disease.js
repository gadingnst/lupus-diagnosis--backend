"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Disease_1 = __importDefault(require("app/Controllers/Disease"));
const Router_1 = __importDefault(require("routes/Router"));
class DiseaseRoute extends Router_1.default {
    constructor() {
        super(Disease_1.default);
    }
    routes() {
        this.router.get('/', this.bindHandler(Disease_1.default.index));
        this.router.get('/:code', this.bindHandler(Disease_1.default.getByCode));
    }
}
exports.default = new DiseaseRoute().router;
