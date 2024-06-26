import {Router} from 'express';
import gamescontroller from '../constrollers/gamesControllers';
import { checkjwt } from "../jwt/jwt";
import { soloadmin } from '../jwt/rol';
class gamesRoutes {

    public router: Router = Router();

    constructor(){
        this.config();
    }
    config(): void{
        //rutas para obtener datos de la base de datos
        this.router.get('/game/', gamescontroller.list);
        this.router.post('/game/',checkjwt,soloadmin(), gamescontroller.create);
        this.router.get('/game/:id',checkjwt, gamescontroller.getone)
        this.router.delete('/game/:id',checkjwt,soloadmin(), gamescontroller.delete);
        this.router.put('/game/:id',checkjwt,soloadmin(), gamescontroller.update);
        this.router.get('/new/', gamescontroller.new);//borrar antes de enviar sin uso actual
        this.router.get('/plataforma/', gamescontroller.plataforma);
        this.router.get('/tipos/', gamescontroller.tipo);
        this.router.get('/estado/',checkjwt,soloadmin(), gamescontroller.estadoProducto)
        //this.router.get('/foto/', gamescontroller.getfoto);
        //this.router.post('/fotos/', gamescontroller.guardarfoto);
    }
}

const gamesroutes = new gamesRoutes();
export default gamesroutes.router; 