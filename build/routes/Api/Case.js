"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Case_1 = __importDefault(require("app/Controllers/Case"));
const Router_1 = __importDefault(require("routes/Router"));
class CaseRoute extends Router_1.default {
    constructor() {
        super(Case_1.default);
    }
    routes() {
        this.router.post('/', this.bindHandler(Case_1.default.post));
    }
}
exports.default = new CaseRoute().router;
