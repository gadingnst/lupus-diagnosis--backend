"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
class Server {
    constructor() {
        this.port = process.env.PORT || 3000;
        this.application = express_1.default();
        this.plugins();
        this.routes();
    }
    plugins() {
        dotenv_1.default.config();
        this.application.use(express_1.default.urlencoded({ extended: true }));
        this.application.use(express_1.default.json());
        this.application.use(compression_1.default());
        this.application.use(helmet_1.default());
        this.application.use(cors_1.default());
        this.application.use(morgan_1.default('dev'));
    }
    routes() {
        this.application.use(routes_1.default);
    }
    run() {
        this.application.listen(this.port, () => {
            console.log(`Server listening on http://localhost:${this.port}`);
        });
    }
}
exports.default = Server;
