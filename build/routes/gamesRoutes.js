"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gamesControllers_1 = __importDefault(require("../constrollers/gamesControllers"));
const jwt_1 = require("../jwt/jwt");
const rol_1 = require("../jwt/rol");
class gamesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //rutas para obtener datos de la base de datos
        this.router.get('/game/', gamesControllers_1.default.list);
        this.router.post('/game/', jwt_1.checkjwt, (0, rol_1.soloadmin)(), gamesControllers_1.default.create);
        this.router.get('/game/:id', jwt_1.checkjwt, gamesControllers_1.default.getone);
        this.router.delete('/game/:id', jwt_1.checkjwt, (0, rol_1.soloadmin)(), gamesControllers_1.default.delete);
        this.router.put('/game/:id', jwt_1.checkjwt, (0, rol_1.soloadmin)(), gamesControllers_1.default.update);
        this.router.get('/new/', gamesControllers_1.default.new); //borrar antes de enviar sin uso actual
        this.router.get('/plataforma/', gamesControllers_1.default.plataforma);
        this.router.get('/tipos/', gamesControllers_1.default.tipo);
        this.router.get('/estado/', jwt_1.checkjwt, (0, rol_1.soloadmin)(), gamesControllers_1.default.estadoProducto);
        //this.router.get('/foto/', gamescontroller.getfoto);
        //this.router.post('/fotos/', gamescontroller.guardarfoto);
    }
}
const gamesroutes = new gamesRoutes();
exports.default = gamesroutes.router;
