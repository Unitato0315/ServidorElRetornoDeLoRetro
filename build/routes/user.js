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
        this.router.delete('/usuario/:id', jwt_1.checkjwt, (0, rol_1.soloadmin)(), userControler_1.default.deleteUser);
    }
}
const Usuario = new usuario();
exports.default = Usuario.router;
