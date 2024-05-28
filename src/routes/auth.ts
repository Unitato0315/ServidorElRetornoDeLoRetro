import { Router } from "express";
import AuthController from '../constrollers/authControllers';

class auth {

    public router: Router = Router();

    constructor(){
        this.config();
    }
    config(): void{
       this.router.post('/login', AuthController.login)
    }
}

const Auth = new auth();
export default Auth.router;