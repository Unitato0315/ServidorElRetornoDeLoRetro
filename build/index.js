"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
//import { createConnection } from 'typeorm';
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const gamesRoutes_1 = __importDefault(require("./routes/gamesRoutes"));
const config_1 = __importDefault(require("./config/config"));
//import { profileEnd } from 'console';
class Server {
    constructor() {
        //const axios = require('axios');
        //const express = require('express');
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json({ limit: '100MB' }));
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', config_1.default.server.port);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/', indexRoutes_1.default);
        this.app.use('/api/', gamesRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server en el puerto', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
