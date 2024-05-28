import mysql,  {} from 'promise-mysql';

import keys from './keys';

//CONEXION CON LA BASE DE DATOS

const pool = mysql.createPool(keys.database);

pool.getConnection()
    .then(connection => {
        pool.releaseConnection(connection);
        console.log('DB is connected');
    });

export default pool;