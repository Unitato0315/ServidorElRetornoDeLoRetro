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
       this.router.post('/pago',checkjwt , userControler.setPago);
       this.router.get('/pago/:id',checkjwt , userControler.getPedidos);
       this.router.get('/pagos',checkjwt,soloadmin(),userControler.getAllPedidos);
       this.router.get('/pago/productos/:id',checkjwt , userControler.getPedidoProductos);
       this.router.delete('/usuario/:id',checkjwt ,soloadmin(), userControler.deleteUser);
       this.router.get('/tiposPagos',userControler.getTiposPagos);
       this.router.get('/tiposEnvios',userControler.getTiposEnvios);
       this.router.put('/cambiarEstado/:id',checkjwt,userControler.cambioEstadoEnvio);
       this.router.put('/datosFacturacion/:id',checkjwt,userControler.cambiarDatosDeFacturacion);
       this.router.post('/crearChat',checkjwt,userControler.crearChat)
       this.router.get('/recuperarChat/:id',checkjwt,userControler.recuperarChat)
       this.router.get('/recuperarAllChat',checkjwt,soloadmin(),userControler.recuperarAllChat)
       this.router.post('/crearMensaje/:id',checkjwt,userControler.crearMensaje);
       this.router.get('/recuperarMensajes/:id',checkjwt,userControler.obtenerMensajes);
       this.router.put('/cambiarEstadoMensaje/:id',checkjwt,userControler.marcarVisto);
    }
}

const Usuario = new usuario();
export default Usuario.router;