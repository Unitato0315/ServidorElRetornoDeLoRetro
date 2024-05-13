import { Request, Response} from 'express';

import pool from '../database';
class gamesController {


    public async new (req: Request, res: Response): Promise<void>{
        const games = await pool.query('SELECT * FROM productos ORDER BY ID_PRODUCTO DESC LIMIT 8');
        res.json(games);
    }

    public async list (req: Request, res: Response): Promise<void>{
        const games = await pool.query('SELECT * FROM productos, tipos, plataforma, estado_producto WHERE estado_producto.ID_ESTADO_PRODUCTO=productos.ID_ESTADO_PRODUCTO AND productos.ID_PLATAFORMA=plataforma.ID_PLATAFORMA AND productos.ID_TIPO=tipos.ID_TIPO ORDER BY productos.ID_PRODUCTO');
        res.json(games);
    }

    public async create (req: Request, res: Response): Promise<void>{ 
       await pool.query('INSERT INTO productos set ?', [req.body]);
        res.json({text: 'Juego guardado'});
    }

    public async delete (req: Request, res: Response): Promise<void>{   
        const { id } = req.params
        await pool.query('DELETE FROM productos WHERE ID_PRODUCTO = ?', [id])
        res.json({text: 'El juego fue eliminado'});
    }

    public async update (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        await pool.query('UPDATE productos set ? WHERE ID_PRODUCTO = ?', [req.body, id])
        res.json({text: 'actualizando el juego '});
    }
    public async getone (req: Request, res: Response): Promise<any>{   
        const { id } = req.params
        const game = await pool.query('SELECT * FROM productos, tipos, plataforma, estado_producto WHERE estado_producto.ID_ESTADO_PRODUCTO=productos.ID_ESTADO_PRODUCTO AND productos.ID_PLATAFORMA=plataforma.ID_PLATAFORMA AND productos.ID_TIPO=tipos.ID_TIPO AND productos.ID_PRODUCTO = ?', [id]);
        if (game.length > 0){
            return res.json(game);
        }
            res.status(404).json({text: "El juego no existe"})
        
    }
    public async plataforma (req: Request, res: Response): Promise<void>{   
        const plat = await pool.query('SELECT * FROM plataforma');
        res.json(plat) 
    }
    public async tipo (req: Request, res: Response): Promise<void>{   
        const tipo = await pool.query('SELECT * FROM tipos');
        res.json(tipo)
    }

    public async estadoProducto (req: Request, res: Response): Promise<void>{   
        const estado = await pool.query('SELECT * FROM estado_producto');
        res.json(estado)
    }

    public async ultimafactura (req: Request, res: Response): Promise<void>{   
        const factura = await pool.query('SELECT * FROM facturas ORDER BY N_FACTURA DESC LIMIT 1');
        res.json(factura)
    }

    public async getPagos(req: Request, res: Response): Promise<void>{
        const pagos = await pool.query('SELECT * FROM pago');
        res.json(pagos)
    }

    public async getEnvios(req: Request, res: Response): Promise<void>{
        const envio = await pool.query('SELECT * FROM envio');
        res.json(envio)
    }

    public async crearFactura (req: Request, res: Response): Promise<void>{
        const {ID_PRODUCTO} = req.body
        await pool.query('INSERT INTO facturas set ?', [req.body]);
        await pool.query('UPDATE productos set ID_ESTADO_PRODUCTO = 3 WHERE ID_PRODUCTO= ?',[ID_PRODUCTO])
        res.json({text: 'Factura creada'});
    }

    public async crearPedido (req: Request, res: Response): Promise<void>{ 
        await pool.query('INSERT INTO pedidos set ?', [req.body]);
        res.json({text: 'Pedido enviado'});
    }

    public async obtenerPedidos (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const pedidos = await pool.query('SELECT * FROM pedidos, envio, pago  WHERE pedidos.ID_PAGO = pago.ID_PAGO && pedidos.ID_ENVIO = envio.ID_ENVIO && pedidos.ID_USUARIO = ?', [id]);
        res.json(pedidos);
    }
    public async obtenerAdminPedidos (req: Request, res: Response): Promise<void>{
        const pedidos = await pool.query('SELECT * FROM pedidos , envio, pago, usuarios  WHERE usuarios.ID_USUARIO=pedidos.ID_USUARIO && pedidos.ID_PAGO = pago.ID_PAGO && pedidos.ID_ENVIO = envio.ID_ENVIO && N_FACTURA > 0 ORDER BY pedidos.N_FACTURA DESC');
        res.json(pedidos);
    }
    public async obtenerIdProductos(req: Request, res: Response): Promise<void>{
        const {id} =req.params
        const lista = await pool.query('SELECT * FROM facturas, productos, plataforma  WHERE facturas.ID_PRODUCTO = productos.ID_PRODUCTOS && productos.ID_PLATAFORMA = plataforma.ID_PLATAFORMA && facturas.N_FACTURA = ?', [id])
        res.json(lista);
    }
    public async obtenerUnPedido (req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        const pedidos = await pool.query('SELECT * FROM pedidos, envio, pago, usuarios  WHERE pedidos.ID_PAGO = pago.ID_PAGO && pedidos.ID_USUARIO=usuarios.ID_USUARIO &&pedidos.ID_ENVIO = envio.ID_ENVIO && pedidos.N_FACTURA = ? ', [id]);
        res.json(pedidos);
    }

    //public async getfoto (req: Request, res: Response): Promise<any>{   
      //  const { id, titulo} = req.params
       // const game = await pool.query('SELECT * FROM imagen');
        //res.json(game)
    //}

    //public async guardarfoto (req: Request, res: Response): Promise<void>{   
      //  const { data } = req.params
       // res.json(req.body)
       // res.json(data)
       // await pool.query("INSERT INTO imagen set ? ", [req.body]);
    //}

}

const gamescontroller = new gamesController();
export default gamescontroller;