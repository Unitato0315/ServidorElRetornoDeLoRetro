import {Router} from 'express';

import auth from './auth';
import user from './user';

import {indexcontroller} from '../constrollers/indexControllers';
class indexRoutes {

    public router: Router = Router();

    constructor(){
        this.config();
    }
    config(): void{
        //pruebas 
        //this.router.get('/', indexcontroller.index);
        this.router.use('/auth', auth)
        this.router.use('/', user)
    }
}

const indexroutes = new indexRoutes();
export default indexroutes.router;