"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Http_1 = __importDefault(require("app/Helpers/Http"));
const HttpError_1 = __importDefault(require("app/Helpers/HttpError"));
class Controller {
    send(res, data) {
        return Http_1.default.send(res, data);
    }
    setError(code, status, msg) {
        throw new HttpError_1.default(code, status, msg);
    }
    handleError(req, res, error) {
        return HttpError_1.default.handle(req, res, error);
    }
}
exports.default = Controller;
