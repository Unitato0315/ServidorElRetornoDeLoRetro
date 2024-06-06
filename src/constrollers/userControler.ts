import { Request, Response} from 'express';
import bcript from 'bcryptjs';
import pool from '../database';
import { text } from 'stream/consumers';

class usuariosController {


    public async getAll (req: Request, res: Response): Promise<void>{
        const user = await pool.query('SELECT * FROM usuarios WHERE ID_ROL != 99');
        if(user.length > 0){
            res.json(user);
        }else{
            res.status(404).json({message: 'No hay resultados'})
        }
    }

    public async newUser (req: Request, res: Response): Promise<void>{
        const {USERNAME, PASSWORD, NOMBRE, APELLIDO, EMAIL, TELEFONO, DNI, PROVINCIA, LOCALIDAD, DIRECCION, CODIGO_POSTAL} = req.body
        
        const salt = bcript.genSaltSync(10);
        const password = bcript.hashSync(PASSWORD, salt)

        
        try {
            await pool.query('INSERT INTO `usuarios`( `USERNAME`, `PASSWORD`, `NOMBRE`, `APELLIDO`,`EMAIL`,`TELEFONO`,`DNI`, `PROVINCIA`, `LOCALIDAD`,`DIRECCION`,`CODIGO_POSTAL` ) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [USERNAME, password, NOMBRE, APELLIDO, EMAIL, TELEFONO, DNI, PROVINCIA, LOCALIDAD, DIRECCION, CODIGO_POSTAL]);
            res.json({message: 'Usuario creado con exito'});
        } catch (error) {
            res.status(409).json({message: "El usuario ya existe"})
        }
       
    }

    public async getByUser (req: Request, res: Response): Promise<void>{
        const { USERNAME } = req.body
        const user = await pool.query('SELECT * FROM usuarios WHERE USERNAME = ?', [USERNAME]);
        res.json(user)
    }

    public async deleteUser (req: Request, res: Response): Promise<void>{   
        const { id } = req.params
        await pool.query('DELETE FROM usuarios WHERE ID_USUARIO = ?', [id])
        res.json({text: 'El usuario fue eliminado'});
    } 

    public async editUser (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        try{
        await pool.query('UPDATE usuarios set ? WHERE ID_USUARIO = ?', [req.body, id])
        res.json({text: 'actualizando el juego '});
        }
        catch(e){
            res.status(404).json({message:"El usuario no existe"})
        }
    }
    public async getById (req: Request, res: Response): Promise<any>{   
        const { id } = req.params
        const user = await pool.query('SELECT * FROM usuarios WHERE ID_USUARIO = ?', [id]);
        if (user.length > 0){
            return res.json(user);
        }
            res.status(404).json({text: "El usuario no existe"})
    }
    public async setPago (req: Request, res: Response): Promise<any>{   
        const{cardNumber, expiryDate, cvv, productId,tipoPago, tipoEnvio, idUsuario ,direccion,localidad,provincia,cp,total} = req.body;

        if(((cardNumber && expiryDate && (cvv && cvv != 999) && productId) || tipoPago != 2) && idUsuario && direccion && localidad && provincia && provincia && tipoPago && tipoEnvio && cp){
            const products = await pool.query('SELECT ID_ESTADO_PRODUCTO, ID_PRODUCTO FROM productos WHERE ID_PRODUCTO IN (?) ',[productId]);
            var disponible = true;
            var productNoDisponibles: any[] = [] 
            products.forEach((product: { ID_ESTADO_PRODUCTO: any, ID_PRODUCTO: any; }) => {
                if(product.ID_ESTADO_PRODUCTO != 1){
                    disponible = false;
                    productNoDisponibles.push(product)
                }
            });
            if(disponible){
                await pool.query('UPDATE productos SET ID_ESTADO_PRODUCTO = 3 WHERE ID_PRODUCTO IN (?)',[productId]);
                var respuesta = await pool.query('INSERT INTO pedidos (ID_USUARIO,ID_PAGO,ID_ENVIO,ID_ESTADO_PEDIDO,DIRECCION,LOCALIDAD,PROVINCIA,CP,TOTAL) VALUES (?,?,?,1,?,?,?,?,?)',[idUsuario,tipoPago,tipoEnvio,direccion,localidad,provincia,cp,total])

                for(const product of products){
                    await pool.query('INSERT INTO productos_pedido (ID_PRODUCTO,ID_PEDIDO) VALUES (?,?)',[product.ID_PRODUCTO,respuesta.insertId]);
                }
                    const TITULO = "Pedido Nº "+ respuesta.insertId
                    const idChat = await pool.query('INSERT INTO chat (ID_USUARIO,ID_TIPO_CHAT,TITULO,ULTIMO_MENSAJE) VALUES (?,3,?,1)',[idUsuario,TITULO])
                    const MENSAJE = "El pedido Nº "+respuesta.insertId+" a sido aceptado, podras comunicarte por este chat para obtener mas informacion"
                    await pool.query('INSERT INTO mensajeria (ID_CHAT,MENSAJE,ADMIN) VALUES (?,?,1)',[idChat.insertId,MENSAJE])
                if(tipoEnvio != 2){
                    
                    res.json({ success: true, message: 'Se ha realizado el pago correctamente', productos : []});
                }else{
                    res.json({ success: true, message: 'Se ha aceptado el pedido', productos : [] });
                }
                
            }else{
                res.json({ success: false, message: productNoDisponibles.length+' producto/s no estan disponibles', productos : productNoDisponibles});
            }
            
        }else{
            res.json({ success: false, message: 'No se ha podido validar el pago', productos : []});
        }

    }

    public async getAllPedidos(req: Request, res: Response):Promise<any>{
        const pedido = await pool.query('SELECT ID_PEDIDO, FECHA, pedidos.DIRECCION, pedidos.PROVINCIA, pedidos.LOCALIDAD, pedidos.CP, estado_pedidos.NOMBRE AS NOMBRE_ESTADO, envio.TIPO_ENVIO, envio.PRECIO, pago.FORMA_DE_PAGO, usuarios.ID_USUARIO, usuarios.NOMBRE, usuarios.APELLIDO, usuarios.EMAIL, usuarios.TELEFONO, pedidos.TOTAL, pedidos.ID_ESTADO_PEDIDO FROM pedidos, estado_pedidos,envio,pago,usuarios WHERE pedidos.ID_USUARIO = usuarios.ID_USUARIO AND pedidos.ID_PAGO = pago.ID_PAGO AND envio.ID_ENVIO=pedidos.ID_ENVIO AND pedidos.ID_ESTADO_PEDIDO = estado_pedidos.ID_ESTADO_PEDIDO ORDER BY FECHA DESC')
        res.json(pedido)
    }

    public async getPedidos (req: Request, res: Response):Promise<any>{
        const {id} = req.params
        const pedido = await pool.query('SELECT ID_PEDIDO, FECHA, pedidos.DIRECCION, pedidos.PROVINCIA, pedidos.LOCALIDAD, pedidos.CP, estado_pedidos.NOMBRE AS NOMBRE_ESTADO, envio.TIPO_ENVIO, envio.PRECIO, pago.FORMA_DE_PAGO, usuarios.ID_USUARIO, usuarios.NOMBRE, usuarios.APELLIDO, usuarios.EMAIL, usuarios.TELEFONO, pedidos.TOTAL, pedidos.ID_ESTADO_PEDIDO  FROM pedidos, estado_pedidos,envio,pago,usuarios WHERE pedidos.ID_USUARIO = usuarios.ID_USUARIO AND pedidos.ID_PAGO = pago.ID_PAGO AND envio.ID_ENVIO=pedidos.ID_ENVIO AND pedidos.ID_ESTADO_PEDIDO = estado_pedidos.ID_ESTADO_PEDIDO AND pedidos.ID_USUARIO = ? ORDER BY FECHA DESC',[id])
        res.json(pedido)
    }
    public async getPedidoProductos (req: Request, res: Response):Promise<any>{
        const {id} = req.params
        const productos = await pool.query('SELECT productos.TITULO, productos.PRECIO_FINAL,tipos.NOMBRE_TIPO, plataforma.NOMBRE_PLATAFORMA FROM productos_pedido,productos,tipos, plataforma WHERE productos_pedido.ID_PEDIDO = ? AND productos.ID_PRODUCTO = productos_pedido.ID_PRODUCTO AND tipos.ID_TIPO = productos.ID_TIPO AND productos.ID_PLATAFORMA = plataforma.ID_PLATAFORMA',[id]);
        res.json(productos)
    }

    public async getTiposPagos(req: Request, res: Response):Promise<any>{
        const pagos = await pool.query('SELECT * FROM pago ORDER BY ID_PAGO')
        res.json(pagos)
    }   
    public async getTiposEnvios(req: Request, res: Response):Promise<any>{
        const envios = await pool.query('SELECT * FROM envio ORDER BY ID_ENVIO')
        res.json(envios)
    }

    public async cambioEstadoEnvio(req: Request, res: Response):Promise<any>{
        const {id} = req.params
        const {idEstado} = req.body
        await pool.query('UPDATE pedidos SET ID_ESTADO_PEDIDO=? WHERE ID_PEDIDO=?',[idEstado,id])
        if(idEstado == 4 || idEstado == 5){
            await pool.query('UPDATE productos SET ID_ESTADO_PRODUCTO = 1 WHERE ID_PRODUCTO IN (SELECT productos.ID_PRODUCTO FROM productos,productos_pedido WHERE productos_pedido.ID_PRODUCTO = productos.ID_PRODUCTO AND productos_pedido.ID_PEDIDO = ?)',[id]);
        }
        res.json({text: 'Estado actualizado'});
    }

    public async cambiarDatosDeFacturacion(req: Request, res: Response):Promise<any>{
        const {id} = req.params
        const {direccion,cp,localidad,telefono,provicia} = req.body
        await pool.query('UPDATE usuarios SET TELEFONO=?, PROVINCIA=?, LOCALIDAD=?, DIRECCION=?, CODIGO_POSTAL=? WHERE ID_USUARIO=?',[telefono,provicia,localidad,direccion,cp,id])
        res.json({text: 'Datos modificados'});
    }

    public async crearChat(req: Request, res: Response):Promise<any>{
        const {ID_USUARIO,ID_TIPO_CHAT,TITULO} = req.body
        await pool.query('INSERT INTO chat (ID_USUARIO,ID_TIPO_CHAT,TITULO) VALUES (?,?,?)',[ID_USUARIO,ID_TIPO_CHAT,TITULO])
        res.json({text: 'Chat creado'})

    }

    public async recuperarChat(req: Request, res: Response):Promise<any>{
        const{id} = req.params
        const chat = await pool.query('SELECT chat.ID_USUARIO , chat.TITULO, tipos_chat.NOMBRE_TIPO_CHAT, chat.ID_TIPO_CHAT, chat.ID_CHAT, usuarios.NOMBRE, usuarios.APELLIDO, chat.ULTIMO_MENSAJE FROM chat,tipos_chat,usuarios WHERE chat.ID_TIPO_CHAT = tipos_chat.ID_TIPO_CHAT AND chat.ID_USUARIO = usuarios.ID_USUARIO AND chat.ID_USUARIO = ? ORDER BY chat.FECHA_ULTIMA_EDICION DESC',[id])
        res.json(chat)
    }

    public async recuperarAllChat(req: Request, res: Response):Promise<any>{
        const chat = await pool.query('SELECT chat.ID_USUARIO , chat.TITULO, tipos_chat.NOMBRE_TIPO_CHAT, chat.ID_TIPO_CHAT, chat.ID_CHAT, usuarios.NOMBRE, usuarios.APELLIDO, chat.ULTIMO_MENSAJE FROM chat,tipos_chat,usuarios WHERE chat.ID_TIPO_CHAT = tipos_chat.ID_TIPO_CHAT AND chat.ID_USUARIO = usuarios.ID_USUARIO ORDER BY chat.FECHA_ULTIMA_EDICION DESC')
        res.json(chat)
    }

    public async crearMensaje(req: Request, res: Response):Promise<any>{
        const{id} = req.params
        const{mensaje,admin} = req.body
        await pool.query('INSERT INTO mensajeria (ID_CHAT,MENSAJE,ADMIN) VALUES (?,?,?)',[id,mensaje,admin])
        await pool.query('UPDATE chat SET ULTIMO_MENSAJE=? WHERE  ID_CHAT=?',[admin,id])
        res.json({text: 'mensaje mandado'})
    }

    public async obtenerMensajes(req: Request, res: Response):Promise<any>{
        const{id} = req.params
        const mensajes = await pool.query('SELECT MENSAJE,ADMIN FROM mensajeria WHERE ID_CHAT = ?',[id])
        res.json(mensajes)
    }

    public async marcarVisto(req: Request, res: Response):Promise<any>{
        const{id} = req.params
        await pool.query('UPDATE chat SET ULTIMO_MENSAJE=2 WHERE  ID_CHAT=?',[id])
        res.json({text: 'Chat en visto'})
    }
}

const userControler = new usuariosController();
export default userControler;