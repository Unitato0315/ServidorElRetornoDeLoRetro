"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexcontroller = void 0;
class indexController {
    index(req, res) {
        res.json({ text: 'API ESTA EN /' });
    }
}
exports.indexcontroller = new indexController();
