"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControler_1 = __importDefault(require("../constrollers/userControler"));
const jwt_1 = require("../jwt/jwt");
const rol_1 = require("../jwt/rol");
class usuario {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/usuario', jwt_1.checkjwt, (0, rol_1.soloadmin)(), userControler_1.default.getAll);
        this.router.get('/usuario/:id', jwt_1.checkjwt, userControler_1.default.getById);
        this.router.get('/check', jwt_1.checkjwt, (0, rol_1.soloadmin)(), userControler_1.default.getByUser);
        this.router.post('/usuario', userControler_1.default.newUser);
        this.router.put('/usuario/:id', jwt_1.checkjwt, userControler_1.default.editUser);
        this.router.post('/pago', jwt_1.checkjwt, userControler_1.default.setPago);
        this.router.get('/pago/:id', jwt_1.checkjwt, userControler_1.default.getPedidos);
        this.router.get('/pagos', jwt_1.checkjwt, (0, rol_1.soloadmin)(), userControler_1.default.getAllPedidos);
        this.router.get('/pago/productos/:id', jwt_1.checkjwt, userControler_1.default.getPedidoProductos);
        this.router.delete('/usuario/:id', jwt_1.checkjwt, (0, rol_1.soloadmin)(), userControler_1.default.deleteUser);
        this.router.get('/tiposPagos', userControler_1.default.getTiposPagos);
        this.router.get('/tiposEnvios', userControler_1.default.getTiposEnvios);
        this.router.put('/cambiarEstado/:id', jwt_1.checkjwt, userControler_1.default.cambioEstadoEnvio);
        this.router.put('/datosFacturacion/:id', jwt_1.checkjwt, userControler_1.default.cambiarDatosDeFacturacion);
        this.router.post('/crearChat', jwt_1.checkjwt, userControler_1.default.crearChat);
        this.router.get('/recuperarChat/:id', jwt_1.checkjwt, userControler_1.default.recuperarChat);
        this.router.get('/recuperarAllChat', jwt_1.checkjwt, (0, rol_1.soloadmin)(), userControler_1.default.recuperarAllChat);
        this.router.post('/crearMensaje/:id', jwt_1.checkjwt, userControler_1.default.crearMensaje);
        this.router.get('/recuperarMensajes/:id', jwt_1.checkjwt, userControler_1.default.obtenerMensajes);
        this.router.put('/cambiarEstadoMensaje/:id', jwt_1.checkjwt, userControler_1.default.marcarVisto);
    }
}
const Usuario = new usuario();
exports.default = Usuario.router;
