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
}

const userControler = new usuariosController();
export default userControler;