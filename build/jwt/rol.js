"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.soloadmin = void 0;
const database_1 = __importDefault(require("../database"));
const soloadmin = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { USERNAME } = res.locals.jwtPayload;
        const user = yield database_1.default.query('SELECT * FROM usuarios WHERE USERNAME = ?', [USERNAME]);
        const role = user[0].ID_ROL;
        if (role === 99) {
            next();
        }
        else {
            res.status(401).json({ message: 'No autorizado' });
        }
    });
};
exports.soloadmin = soloadmin;
