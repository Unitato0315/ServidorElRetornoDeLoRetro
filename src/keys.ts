// CLAVES PARA PODER ACCEDER A LA BASE DE  DATOS
export default{
    database:{
        host: 'f80b6byii2vwv8cx.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
        user: 'zf2ii2uarodkhpub',
        password: 'lragya83w6udaxz8',
        database: 'm0dif6t0s1x51rwu'
    },
   jwtSecret: process.env.JWT_SECRET || 'somesecrettoken'
}