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
class gamesController {
    new(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const games = yield database_1.default.query('SELECT * FROM productos ORDER BY ID_PRODUCTO DESC LIMIT 8');
            res.json(games);
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const games = yield database_1.default.query('SELECT * FROM productos, tipos, plataforma, estado_producto WHERE estado_producto.ID_ESTADO_PRODUCTO=productos.ID_ESTADO_PRODUCTO AND productos.ID_PLATAFORMA=plataforma.ID_PLATAFORMA AND productos.ID_TIPO=tipos.ID_TIPO AND productos.ID_ESTADO_PRODUCTO = 1 ORDER BY productos.ID_PRODUCTO');
            res.json(games);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO productos set ?', [req.body]);
            res.json({ text: 'Juego guardado' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('DELETE FROM productos WHERE ID_PRODUCTO = ?', [id]);
            res.json({ text: 'El juego fue eliminado' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('UPDATE productos set ? WHERE ID_PRODUCTO = ?', [req.body, id]);
            res.json({ text: 'actualizando el juego ' });
        });
    }
    getone(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const game = yield database_1.default.query('SELECT * FROM productos, tipos, plataforma, estado_producto WHERE estado_producto.ID_ESTADO_PRODUCTO=productos.ID_ESTADO_PRODUCTO AND productos.ID_PLATAFORMA=plataforma.ID_PLATAFORMA AND productos.ID_TIPO=tipos.ID_TIPO AND productos.ID_PRODUCTO = ?', [id]);
            if (game.length > 0) {
                return res.json(game);
            }
            res.status(404).json({ text: "El juego no existe" });
        });
    }
    plataforma(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const plat = yield database_1.default.query('SELECT * FROM plataforma GROUP BY ID_PLATAFORMA');
            res.json(plat);
        });
    }
    tipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipo = yield database_1.default.query('SELECT * FROM tipos GROUP BY ID_TIPO');
            res.json(tipo);
        });
    }
    estadoProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const estado = yield database_1.default.query('SELECT * FROM estado_producto');
            res.json(estado);
        });
    }
}
const gamescontroller = new gamesController();
exports.default = gamescontroller;
