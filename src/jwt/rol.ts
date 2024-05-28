import { Request, Response, NextFunction } from "express";
import pool from "../database";
import Auth from '../routes/auth';
import { Jwt } from "jsonwebtoken";

export	const soloadmin = () =>{
    
    return async (req: Request, res:Response, next: NextFunction)=>{
        const { USERNAME } = res.locals.jwtPayload
        const user = await pool.query('SELECT * FROM usuarios WHERE USERNAME = ?', [USERNAME]);
        const role = user[0].ID_ROL;
        if (role === 99){ 
             next();
        }else{
            res.status(401).json({message: 'No autorizado'})
        }
    }
}
