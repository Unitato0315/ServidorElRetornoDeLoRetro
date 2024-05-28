import { Request, Response} from 'express';
import bcript from 'bcryptjs';
import pool from '../database';

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
        const{cardNumber, expiryDate, cvv, productId,tipoPago, tipoEnvio, idUsuario ,direccion,localidad,provincia,cp} = req.body;

        if(((cardNumber && expiryDate && cvv && productId) || tipoPago != 5) && idUsuario && direccion && localidad && provincia && provincia && tipoPago && tipoEnvio && cp){
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
                var respuesta = await pool.query('INSERT INTO pedidos (ID_USUARIO,ID_PAGO,ID_ENVIO,ID_ESTADO_PEDIDO,DIRECCION,LOCALIDAD,PROVINCIA,CP) VALUES (?,?,1,?,?,?,?,?)',[idUsuario,tipoPago,tipoEnvio,direccion,localidad,provincia,cp])

                for(const product of products){
                    await pool.query('INSERT INTO productos_pedido (ID_PRODUCTO,ID_PEDIDO) VALUES (?,?)',[product.ID_PRODUCTO,respuesta.insertId]);
                }

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

    public async getPedidos (req: Request, res: Response):Promise<any>{
        const {id} = req.params
        const pedido = await pool.query('SELECT ID_PEDIDO, FECHA, pedidos.DIRECCION, pedidos.PROVINCIA, pedidos.LOCALIDAD, pedidos.CP, estado_pedidos.NOMBRE, envio.TIPO_ENVIO, envio.PRECIO, pago.FORMA_DE_PAGO, usuarios.ID_USUARIO, usuarios.NOMBRE, usuarios.APELLIDO, usuarios.EMAIL, usuarios.TELEFONO  FROM pedidos, estado_pedidos,envio,pago,usuarios WHERE pedidos.ID_USUARIO = usuarios.ID_USUARIO AND pedidos.ID_PAGO = pago.ID_PAGO AND envio.ID_ENVIO=pedidos.ID_ENVIO AND pedidos.ID_ESTADO_PEDIDO = estado_pedidos.ID_ESTADO_PEDIDO AND pedidos.ID_PEDIDO = ?',[id])
        res.json(pedido)
    }
    public async getPedidoProductos (req: Request, res: Response):Promise<any>{
        const {id} = req.params
        const productos = await pool.query('SELECT productos.TITULO, productos.PRECIO_FINAL,tipos.NOMBRE_TIPO, plataforma.NOMBRE_PLATAFORMA FROM productos_pedido,productos,tipos, plataforma WHERE productos_pedido.ID_PEDIDO = ? AND productos.ID_PRODUCTO = productos_pedido.ID_PRODUCTO AND tipos.ID_TIPO = productos.ID_TIPO AND productos.ID_PLATAFORMA = plataforma.ID_PLATAFORMA',[id]);
        res.json(productos)
    }
}

const userControler = new usuariosController();
export default userControler;