"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
global.__basedir = __dirname;
const server_1 = __importDefault(require("./server"));
const server = new server_1.default();
server.run();
