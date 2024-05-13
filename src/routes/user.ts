import { Router } from "express";
import userControler from "../constrollers/userControler";
import { checkjwt } from "../jwt/jwt";
import { soloadmin } from '../jwt/rol';
class usuario {

    public router: Router = Router();

    constructor(){
        this.config();
    }
    config(): void{
       this.router.get('/usuario',checkjwt,soloadmin(), userControler.getAll);
       this.router.get('/usuario/:id',checkjwt, userControler.getById);
       this.router.get('/check',checkjwt,soloadmin() , userControler.getByUser);
       this.router.post('/usuario', userControler.newUser);
       this.router.put('/usuario/:id',checkjwt , userControler.editUser);
       this.router.delete('/usuario/:id',checkjwt ,soloadmin(), userControler.deleteUser)
    }
}

const Usuario = new usuario();
export default Usuario.router;