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
const Model_1 = __importDefault(require("./Model"));
const Disease_1 = __importDefault(require("./Disease"));
const Indication_1 = __importDefault(require("./Indication"));
class Case extends Model_1.default {
    constructor() {
        super('train.json');
        this.primaryKey = 'id';
        this.disease = new Disease_1.default();
        this.indication = new Indication_1.default();
    }
    predict(input) {
        return __awaiter(this, void 0, void 0, function* () {
            input = input.map(indication => indication.toUpperCase().trim());
            const [cases, diseases, indications] = yield Promise.all([
                this.all(),
                this.disease.all(),
                this.indication.all()
            ]);
            const priors = this.getProbability(cases, diseases);
            const classification = this.classify('P1', cases, indications);
        });
    }
    filterByDisease(disease) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.all();
            return data.filter((train) => train.disease === disease.toUpperCase().trim());
        });
    }
    classify(code, cases, indications) {
        return cases.reduce((accumulator, current) => {
            if (code === current.disease) {
                accumulator.sample++;
                const indication = indications.reduce((acc, cur) => {
                    var _a, _b;
                    const positive = current.indications.some(indic => indic === cur.code);
                    const accPositive = ((_a = acc[cur.code]) === null || _a === void 0 ? void 0 : _a.positive) || 0;
                    const accNegative = ((_b = acc[cur.code]) === null || _b === void 0 ? void 0 : _b.negative) || 0;
                    acc[cur.code] = {
                        positive: positive ? accPositive + 1 : accPositive,
                        negative: !positive ? accNegative + 1 : accNegative
                    };
                    return acc;
                }, {});
                console.log(indication);
            }
            return accumulator;
        }, { disease: code, sample: 0, indication: {} });
    }
    getProbability(cases, diseases) {
        return diseases.reduce((acc, cur) => {
            const sample = diseases.length;
            acc.totalCase = cases.length;
            acc.prior[cur.code] = { sample, amount: sample / acc.totalCase };
            return acc;
        }, { totalCase: 0, prior: {} });
    }
}
exports.default = Case;
