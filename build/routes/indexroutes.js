"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
class indexRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //pruebas 
        //this.router.get('/', indexcontroller.index);
        this.router.use('/auth', auth_1.default);
        this.router.use('/', user_1.default);
    }
}
const indexroutes = new indexRoutes();
exports.default = indexroutes.router;
