"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("app/Controllers/Controller"));
const Case_1 = __importDefault(require("app/Models/Case"));
class CaseController extends Controller_1.default {
    constructor() {
        super();
        this.model = new Case_1.default();
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { indications } = req.body;
            try {
                const disease = this.model.predict(indications);
                this.send(res, {
                    code: 200,
                    status: 'OK!',
                    message: `Sukses`
                });
            }
            catch (err) {
                this.handleError(req, res, err);
            }
        });
    }
}
exports.default = new CaseController();
