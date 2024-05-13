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
const database_1 = __importDefault(require("../database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            if (!(username && password)) {
                res.status(409).json({ message: 'Username y contraseña son requeridos' });
            }
            else {
                const user = yield database_1.default.query("SELECT * FROM usuarios WHERE USERNAME = ?", [username]);
                if (user.length < 1) {
                    res.status(400).json({ message: 'Datos incorrectos' });
                }
                else {
                    const value = yield bcryptjs_1.default.compare(password, user[0].PASSWORD);
                    if (value) {
                        const id = user[0].ID_USUARIO;
                        const rol = user[0].ID_ROL;
                        const token = jsonwebtoken_1.default.sign({ ID_USUARIO: user[0].ID_USUARIO, USERNAME: user[0].USERNAME, ID_ROL: user[0].ID_ROL }, config_1.default.jwtSecret, { expiresIn: '6h' });
                        res.send({ message: 'OK', token });
                    }
                    else {
                        res.status(400).json({ message: "Datos incorrectos" });
                    }
                }
            }
        });
    }
}
const authcontroller = new AuthController();
exports.default = authcontroller;
