import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import config from "../config/config";

export const checkjwt = (req: Request, res: Response, next: NextFunction) =>{
    const token = <string>req.headers['auth'];
    let jwtPayload;
    try{
        jwtPayload = <any> jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    }catch(e){
        return res.status(401).send();
    }
    const {USERNAME, ID_USUARIO, ID_ROL} = jwtPayload;
    const newtoken = jwt.sign({USERNAME, ID_USUARIO, ID_ROL}, config.jwtSecret, {expiresIn:'6h'});
    res.setHeader('token', newtoken);
    next(); 
}