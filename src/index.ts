import express, {Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
//import { createConnection } from 'typeorm';

import indexRoutes from './routes/indexRoutes';
import gamesRoutes from './routes/gamesRoutes';
import config from './config/config';
//import { profileEnd } from 'console';

class Server {

    public app: Application;
    
    constructor() {
        //const axios = require('axios');
        //const express = require('express');
        this.app = express();  
        this.app.use(express.json({limit: '100MB' })); 
        this.config();
        this.routes();

    }

    config(): void{
        this.app.set('port', config.server.port);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(helmet())
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        
    }

    routes(): void{
        this.app.use('/',indexRoutes);
        this.app.use('/api/', gamesRoutes);
    }

    start(): void{
        this.app.listen(this.app.get('port'), () => {
            console.log('Server en el puerto', this.app.get('port'));
        })
    }
    
}

const server = new Server();
server.start();