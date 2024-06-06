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
    setPago(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cardNumber, expiryDate, cvv, productId, tipoPago, tipoEnvio, idUsuario, direccion, localidad, provincia, cp, total } = req.body;
            if (((cardNumber && expiryDate && (cvv && cvv != 999) && productId) || tipoPago != 2) && idUsuario && direccion && localidad && provincia && provincia && tipoPago && tipoEnvio && cp) {
                const products = yield database_1.default.query('SELECT ID_ESTADO_PRODUCTO, ID_PRODUCTO FROM productos WHERE ID_PRODUCTO IN (?) ', [productId]);
                var disponible = true;
                var productNoDisponibles = [];
                products.forEach((product) => {
                    if (product.ID_ESTADO_PRODUCTO != 1) {
                        disponible = false;
                        productNoDisponibles.push(product);
                    }
                });
                if (disponible) {
                    yield database_1.default.query('UPDATE productos SET ID_ESTADO_PRODUCTO = 3 WHERE ID_PRODUCTO IN (?)', [productId]);
                    var respuesta = yield database_1.default.query('INSERT INTO pedidos (ID_USUARIO,ID_PAGO,ID_ENVIO,ID_ESTADO_PEDIDO,DIRECCION,LOCALIDAD,PROVINCIA,CP,TOTAL) VALUES (?,?,?,1,?,?,?,?,?)', [idUsuario, tipoPago, tipoEnvio, direccion, localidad, provincia, cp, total]);
                    for (const product of products) {
                        yield database_1.default.query('INSERT INTO productos_pedido (ID_PRODUCTO,ID_PEDIDO) VALUES (?,?)', [product.ID_PRODUCTO, respuesta.insertId]);
                    }
                    const TITULO = "Pedido Nº " + respuesta.insertId;
                    const idChat = yield database_1.default.query('INSERT INTO chat (ID_USUARIO,ID_TIPO_CHAT,TITULO,ULTIMO_MENSAJE) VALUES (?,3,?,1)', [idUsuario, TITULO]);
                    const MENSAJE = "El pedido Nº " + respuesta.insertId + " a sido aceptado, podras comunicarte por este chat para obtener mas informacion";
                    yield database_1.default.query('INSERT INTO mensajeria (ID_CHAT,MENSAJE,ADMIN) VALUES (?,?,1)', [idChat.insertId, MENSAJE]);
                    if (tipoEnvio != 2) {
                        res.json({ success: true, message: 'Se ha realizado el pago correctamente', productos: [] });
                    }
                    else {
                        res.json({ success: true, message: 'Se ha aceptado el pedido', productos: [] });
                    }
                }
                else {
                    res.json({ success: false, message: productNoDisponibles.length + ' producto/s no estan disponibles', productos: productNoDisponibles });
                }
            }
            else {
                res.json({ success: false, message: 'No se ha podido validar el pago', productos: [] });
            }
        });
    }
    getAllPedidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pedido = yield database_1.default.query('SELECT ID_PEDIDO, FECHA, pedidos.DIRECCION, pedidos.PROVINCIA, pedidos.LOCALIDAD, pedidos.CP, estado_pedidos.NOMBRE AS NOMBRE_ESTADO, envio.TIPO_ENVIO, envio.PRECIO, pago.FORMA_DE_PAGO, usuarios.ID_USUARIO, usuarios.NOMBRE, usuarios.APELLIDO, usuarios.EMAIL, usuarios.TELEFONO, pedidos.TOTAL, pedidos.ID_ESTADO_PEDIDO FROM pedidos, estado_pedidos,envio,pago,usuarios WHERE pedidos.ID_USUARIO = usuarios.ID_USUARIO AND pedidos.ID_PAGO = pago.ID_PAGO AND envio.ID_ENVIO=pedidos.ID_ENVIO AND pedidos.ID_ESTADO_PEDIDO = estado_pedidos.ID_ESTADO_PEDIDO ORDER BY FECHA DESC');
            res.json(pedido);
        });
    }
    getPedidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedido = yield database_1.default.query('SELECT ID_PEDIDO, FECHA, pedidos.DIRECCION, pedidos.PROVINCIA, pedidos.LOCALIDAD, pedidos.CP, estado_pedidos.NOMBRE AS NOMBRE_ESTADO, envio.TIPO_ENVIO, envio.PRECIO, pago.FORMA_DE_PAGO, usuarios.ID_USUARIO, usuarios.NOMBRE, usuarios.APELLIDO, usuarios.EMAIL, usuarios.TELEFONO, pedidos.TOTAL, pedidos.ID_ESTADO_PEDIDO  FROM pedidos, estado_pedidos,envio,pago,usuarios WHERE pedidos.ID_USUARIO = usuarios.ID_USUARIO AND pedidos.ID_PAGO = pago.ID_PAGO AND envio.ID_ENVIO=pedidos.ID_ENVIO AND pedidos.ID_ESTADO_PEDIDO = estado_pedidos.ID_ESTADO_PEDIDO AND pedidos.ID_USUARIO = ? ORDER BY FECHA DESC', [id]);
            res.json(pedido);
        });
    }
    getPedidoProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const productos = yield database_1.default.query('SELECT productos.TITULO, productos.PRECIO_FINAL,tipos.NOMBRE_TIPO, plataforma.NOMBRE_PLATAFORMA FROM productos_pedido,productos,tipos, plataforma WHERE productos_pedido.ID_PEDIDO = ? AND productos.ID_PRODUCTO = productos_pedido.ID_PRODUCTO AND tipos.ID_TIPO = productos.ID_TIPO AND productos.ID_PLATAFORMA = plataforma.ID_PLATAFORMA', [id]);
            res.json(productos);
        });
    }
    getTiposPagos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagos = yield database_1.default.query('SELECT * FROM pago ORDER BY ID_PAGO');
            res.json(pagos);
        });
    }
    getTiposEnvios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const envios = yield database_1.default.query('SELECT * FROM envio ORDER BY ID_ENVIO');
            res.json(envios);
        });
    }
    cambioEstadoEnvio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { idEstado } = req.body;
            yield database_1.default.query('UPDATE pedidos SET ID_ESTADO_PEDIDO=? WHERE ID_PEDIDO=?', [idEstado, id]);
            if (idEstado == 4 || idEstado == 5) {
                yield database_1.default.query('UPDATE productos SET ID_ESTADO_PRODUCTO = 1 WHERE ID_PRODUCTO IN (SELECT productos.ID_PRODUCTO FROM productos,productos_pedido WHERE productos_pedido.ID_PRODUCTO = productos.ID_PRODUCTO AND productos_pedido.ID_PEDIDO = ?)', [id]);
            }
            res.json({ text: 'Estado actualizado' });
        });
    }
    cambiarDatosDeFacturacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { direccion, cp, localidad, telefono, provicia } = req.body;
            yield database_1.default.query('UPDATE usuarios SET TELEFONO=?, PROVINCIA=?, LOCALIDAD=?, DIRECCION=?, CODIGO_POSTAL=? WHERE ID_USUARIO=?', [telefono, provicia, localidad, direccion, cp, id]);
            res.json({ text: 'Datos modificados' });
        });
    }
    crearChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID_USUARIO, ID_TIPO_CHAT, TITULO } = req.body;
            yield database_1.default.query('INSERT INTO chat (ID_USUARIO,ID_TIPO_CHAT,TITULO) VALUES (?,?,?)', [ID_USUARIO, ID_TIPO_CHAT, TITULO]);
            res.json({ text: 'Chat creado' });
        });
    }
    recuperarChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const chat = yield database_1.default.query('SELECT chat.ID_USUARIO , chat.TITULO, tipos_chat.NOMBRE_TIPO_CHAT, chat.ID_TIPO_CHAT, chat.ID_CHAT, usuarios.NOMBRE, usuarios.APELLIDO, chat.ULTIMO_MENSAJE FROM chat,tipos_chat,usuarios WHERE chat.ID_TIPO_CHAT = tipos_chat.ID_TIPO_CHAT AND chat.ID_USUARIO = usuarios.ID_USUARIO AND chat.ID_USUARIO = ? ORDER BY chat.FECHA_ULTIMA_EDICION DESC', [id]);
            res.json(chat);
        });
    }
    recuperarAllChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield database_1.default.query('SELECT chat.ID_USUARIO , chat.TITULO, tipos_chat.NOMBRE_TIPO_CHAT, chat.ID_TIPO_CHAT, chat.ID_CHAT, usuarios.NOMBRE, usuarios.APELLIDO, chat.ULTIMO_MENSAJE FROM chat,tipos_chat,usuarios WHERE chat.ID_TIPO_CHAT = tipos_chat.ID_TIPO_CHAT AND chat.ID_USUARIO = usuarios.ID_USUARIO ORDER BY chat.FECHA_ULTIMA_EDICION DESC');
            res.json(chat);
        });
    }
    crearMensaje(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { mensaje, admin } = req.body;
            yield database_1.default.query('INSERT INTO mensajeria (ID_CHAT,MENSAJE,ADMIN) VALUES (?,?,?)', [id, mensaje, admin]);
            yield database_1.default.query('UPDATE chat SET ULTIMO_MENSAJE=? WHERE  ID_CHAT=?', [admin, id]);
            res.json({ text: 'mensaje mandado' });
        });
    }
    obtenerMensajes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const mensajes = yield database_1.default.query('SELECT MENSAJE,ADMIN FROM mensajeria WHERE ID_CHAT = ?', [id]);
            res.json(mensajes);
        });
    }
    marcarVisto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('UPDATE chat SET ULTIMO_MENSAJE=2 WHERE  ID_CHAT=?', [id]);
            res.json({ text: 'Chat en visto' });
        });
    }
}
const userControler = new usuariosController();
exports.default = userControler;
