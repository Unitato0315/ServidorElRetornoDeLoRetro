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
            const games = yield database_1.default.query('SELECT * FROM productos, tipos, plataforma, estado_producto WHERE estado_producto.ID_ESTADO_PRODUCTO=productos.ID_ESTADO_PRODUCTO AND productos.ID_PLATAFORMA=plataforma.ID_PLATAFORMA AND productos.ID_TIPO=tipos.ID_TIPO ORDER BY productos.ID_PRODUCTO');
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
            const plat = yield database_1.default.query('SELECT * FROM plataforma');
            res.json(plat);
        });
    }
    tipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipo = yield database_1.default.query('SELECT * FROM tipos');
            res.json(tipo);
        });
    }
    estadoProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const estado = yield database_1.default.query('SELECT * FROM estado_producto');
            res.json(estado);
        });
    }
    ultimafactura(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const factura = yield database_1.default.query('SELECT * FROM facturas ORDER BY N_FACTURA DESC LIMIT 1');
            res.json(factura);
        });
    }
    getPagos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagos = yield database_1.default.query('SELECT * FROM pago');
            res.json(pagos);
        });
    }
    getEnvios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const envio = yield database_1.default.query('SELECT * FROM envio');
            res.json(envio);
        });
    }
    crearFactura(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID_PRODUCTO } = req.body;
            yield database_1.default.query('INSERT INTO facturas set ?', [req.body]);
            yield database_1.default.query('UPDATE productos set ID_ESTADO_PRODUCTO = 3 WHERE ID_PRODUCTO= ?', [ID_PRODUCTO]);
            res.json({ text: 'Factura creada' });
        });
    }
    crearPedido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO pedidos set ?', [req.body]);
            res.json({ text: 'Pedido enviado' });
        });
    }
    obtenerPedidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedidos = yield database_1.default.query('SELECT * FROM pedidos, envio, pago  WHERE pedidos.ID_PAGO = pago.ID_PAGO && pedidos.ID_ENVIO = envio.ID_ENVIO && pedidos.ID_USUARIO = ?', [id]);
            res.json(pedidos);
        });
    }
    obtenerAdminPedidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pedidos = yield database_1.default.query('SELECT * FROM pedidos , envio, pago, usuarios  WHERE usuarios.ID_USUARIO=pedidos.ID_USUARIO && pedidos.ID_PAGO = pago.ID_PAGO && pedidos.ID_ENVIO = envio.ID_ENVIO && N_FACTURA > 0 ORDER BY pedidos.N_FACTURA DESC');
            res.json(pedidos);
        });
    }
    obtenerIdProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const lista = yield database_1.default.query('SELECT * FROM facturas, productos, plataforma  WHERE facturas.ID_PRODUCTO = productos.ID_PRODUCTOS && productos.ID_PLATAFORMA = plataforma.ID_PLATAFORMA && facturas.N_FACTURA = ?', [id]);
            res.json(lista);
        });
    }
    obtenerUnPedido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedidos = yield database_1.default.query('SELECT * FROM pedidos, envio, pago, usuarios  WHERE pedidos.ID_PAGO = pago.ID_PAGO && pedidos.ID_USUARIO=usuarios.ID_USUARIO &&pedidos.ID_ENVIO = envio.ID_ENVIO && pedidos.N_FACTURA = ? ', [id]);
            res.json(pedidos);
        });
    }
}
const gamescontroller = new gamesController();
exports.default = gamescontroller;
