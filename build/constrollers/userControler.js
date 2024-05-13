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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../database"));
class usuariosController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.default.query('SELECT * FROM usuarios WHERE ID_ROL != 99');
            if (user.length > 0) {
                res.json(user);
            }
            else {
                res.status(404).json({ message: 'No hay resultados' });
            }
        });
    }
    newUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { USERNAME, PASSWORD, NOMBRE, APELLIDO, EMAIL, TELEFONO, DNI, PROVINCIA, LOCALIDAD, DIRECCION, CODIGO_POSTAL } = req.body;
            const salt = bcryptjs_1.default.genSaltSync(10);
            const password = bcryptjs_1.default.hashSync(PASSWORD, salt);
            try {
                yield database_1.default.query('INSERT INTO `usuarios`( `USERNAME`, `PASSWORD`, `NOMBRE`, `APELLIDO`,`EMAIL`,`TELEFONO`,`DNI`, `PROVINCIA`, `LOCALIDAD`,`DIRECCION`,`CODIGO_POSTAL` ) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [USERNAME, password, NOMBRE, APELLIDO, EMAIL, TELEFONO, DNI, PROVINCIA, LOCALIDAD, DIRECCION, CODIGO_POSTAL]);
                res.json({ message: 'Usuario creado con exito' });
            }
            catch (error) {
                res.status(409).json({ message: "El usuario ya existe" });
            }
        });
    }
    getByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { USERNAME } = req.body;
            const user = yield database_1.default.query('SELECT * FROM usuarios WHERE USERNAME = ?', [USERNAME]);
            res.json(user);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('DELETE FROM usuarios WHERE ID_USUARIO = ?', [id]);
            res.json({ text: 'El usuario fue eliminado' });
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield database_1.default.query('UPDATE usuarios set ? WHERE ID_USUARIO = ?', [req.body, id]);
                res.json({ text: 'actualizando el juego ' });
            }
            catch (e) {
                res.status(404).json({ message: "El usuario no existe" });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield database_1.default.query('SELECT * FROM usuarios WHERE ID_USUARIO = ?', [id]);
            if (user.length > 0) {
                return res.json(user);
            }
            res.status(404).json({ text: "El usuario no existe" });
        });
    }
}
const userControler = new usuariosController();
exports.default = userControler;
