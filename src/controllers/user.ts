import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

export const newUser = async (req: Request, res: Response) => {
    
    const { username, password } = req.body;
    //validamos si existe el user en la bd
   
    const user = await User.findOne({ where: { username: username} });
    
    if (user) {
        return res.status(400).json({
            msg: `ya existe un usuario con el nombre ${username}`
        })
    }
   


    const hashedPassword = await bcrypt.hash(password,10); 
    
    try {
        //Guardamos ususario en la base de datos
        await User.create({
            username:username,
            password:hashedPassword,
        })
    
       res.json({
            msg: `Usuario: ${username} creado exitosamente`
        })
        
    } catch (error) {
        res.status(400).json({
            msg: "Upss ocurrio un error",
            error
        })
    }
}

export const loginUser =  async(req: Request,res: Response) => {
   
    const { username, password } = req.body;
    //Validamos si el ususario existe en la base de datos
    const user:any = await User.findOne({ where: { username: username} });
    if(!user){
        return res.status(400).json({
            msg: `No existe el nombre ${username} en la base de datos`
        })
    }
    //validamos password
    const passwordValido = await bcrypt.compare(password,user.password);
    if(!passwordValido){
        return res.status(400).json({
            msg:`Password incorrecto`
        })
    }
    //generamos token
    const token = jwt.sign({
        username:username,
    }, process.env.SECRET_KEY || 'admin123');

    res.json({token});
}