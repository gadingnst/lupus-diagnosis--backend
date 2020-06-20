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
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const configs_1 = require("configs");
class Model {
    constructor(datasetName) {
        this.dataset = `${configs_1.DATASET_PATH}/${datasetName}`;
        this.dataext = datasetName.split('.').slice(-1)[0];
    }
    all() {
        return this.getData();
    }
    findByPk(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.all();
            return data.find(row => row[this.primaryKey] === key) || false;
        });
    }
    getData() {
        return new Promise((resolve, reject) => {
            if (this.dataext === 'csv') {
                const data = [];
                fs_1.default.createReadStream(this.dataset)
                    .pipe(csv_parser_1.default())
                    .on('data', (row) => data.push(row))
                    .on('error', err => reject(err))
                    .on('end', () => resolve(data));
            }
            else if (this.dataext === 'json') {
                fs_1.default.readFile(this.dataset, 'utf-8', (err, data) => {
                    if (err)
                        reject(err);
                    else
                        resolve(JSON.parse(data));
                });
            }
            else {
                reject('File extension not valid. Must CSV (.csv) or JSON (.json)');
            }
        });
    }
}
exports.default = Model;
