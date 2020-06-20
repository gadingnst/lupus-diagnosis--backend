"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Router_1 = __importDefault(require("routes/Router"));
const Disease_1 = __importDefault(require("./Disease"));
const Indication_1 = __importDefault(require("./Indication"));
const Case_1 = __importDefault(require("./Case"));
class ApiRoute extends Router_1.default {
    routes() {
        this.router.use('/diseases', Disease_1.default);
        this.router.use('/indications', Indication_1.default);
        this.router.use('/cases', Case_1.default);
    }
}
exports.default = new ApiRoute().router;
