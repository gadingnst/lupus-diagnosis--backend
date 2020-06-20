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
const Indication_1 = __importDefault(require("app/Models/Indication"));
class IndicationController extends Controller_1.default {
    constructor() {
        super();
        this.model = new Indication_1.default();
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.model.all();
                this.send(res, {
                    code: 200,
                    status: 'OK!',
                    message: `Sukses mengambil ${data.length} data gejala penyakit`,
                    data
                });
            }
            catch (err) {
                this.handleError(req, res, err);
            }
        });
    }
    getByCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            try {
                const data = yield this.model.findByPk(code.toUpperCase().trim());
                if (!data)
                    this.setError(404, 'Not Found.', `Gejala penyakit dengan kode ${code} tidak ditemukan.`);
                this.send(res, {
                    code: 200,
                    status: 'OK!',
                    message: 'Sukses mengambil data gejala penyakit.',
                    data
                });
            }
            catch (err) {
                this.handleError(req, res, err);
            }
        });
    }
}
exports.default = new IndicationController();
