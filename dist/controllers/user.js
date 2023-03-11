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
exports.loginUser = exports.newUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    //validamos si existe el user en la bd
    const user = yield user_1.User.findOne({ where: { username: username } });
    if (user) {
        return res.status(400).json({
            msg: `ya existe un usuario con el nombre ${username}`
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        //Guardamos ususario en la base de datos
        yield user_1.User.create({
            username: username,
            password: hashedPassword,
        });
        res.json({
            msg: `Usuario: ${username} creado exitosamente`
        });
    }
    catch (error) {
        res.status(400).json({
            msg: "Upss ocurrio un error",
            error
        });
    }
});
exports.newUser = newUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    //Validamos si el ususario existe en la base de datos
    const user = yield user_1.User.findOne({ where: { username: username } });
    if (!user) {
        return res.status(400).json({
            msg: `No existe el nombre ${username} en la base de datos`
        });
    }
    //validamos password
    const passwordValido = yield bcrypt_1.default.compare(password, user.password);
    if (!passwordValido) {
        return res.status(400).json({
            msg: `Password incorrecto`
        });
    }
    //generamos token
    const token = jsonwebtoken_1.default.sign({
        username: username,
    }, process.env.SECRET_KEY || 'admin123');
    res.json({ token });
});
exports.loginUser = loginUser;
