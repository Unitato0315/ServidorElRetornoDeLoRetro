import { Request, Response} from 'express';

class indexController {

    public index (req: Request, res: Response){
        res.json({text: 'API ESTA EN /'})
    }

}

export const indexcontroller = new indexController();