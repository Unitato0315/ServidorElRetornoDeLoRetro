"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkjwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const checkjwt = (req, res, next) => {
    const token = req.headers['auth'];
    let jwtPayload;
    try {
        jwtPayload = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    }
    catch (e) {
        return res.status(401).send();
    }
    const { USERNAME, ID_USUARIO, ID_ROL } = jwtPayload;
    const newtoken = jsonwebtoken_1.default.sign({ USERNAME, ID_USUARIO, ID_ROL }, config_1.default.jwtSecret, { expiresIn: '6h' });
    res.setHeader('token', newtoken);
    next();
};
exports.checkjwt = checkjwt;
