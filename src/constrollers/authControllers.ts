//import {getRepository} from 'typeorm';
import {Request, Response} from 'express';
import pool from '../database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';


class AuthController{
  public async login (req: Request, res: Response){
    const { username, password } = req.body;
    if (!(username && password)){
      res.status(409).json({message: 'Username y contraseña son requeridos'});
    } else{
      const user  =  await pool.query("SELECT * FROM usuarios WHERE USERNAME = ?",[username]);
      if (user.length < 1){
        res.status(400).json({message: 'Datos incorrectos'});
      }else{ 
        const value = await bcrypt.compare(password, user[0].PASSWORD)
        if(value){
          const id = user[0].ID_USUARIO
          const rol = user[0].ID_ROL
          const token = jwt.sign({ID_USUARIO: user[0].ID_USUARIO, USERNAME: user[0].USERNAME, ID_ROL: user[0].ID_ROL}, config.jwtSecret, {expiresIn:'30d'})
          res.send({message: 'OK', token})
        }else{
          const token = "falso"
          res.status(400).json({message: "Datos incorrectos",token})
        }
      }
    }
  }
}
const authcontroller = new AuthController();
export default authcontroller;