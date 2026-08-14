import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Se valida el formato del correo
const correoValido = (correo: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

// Genera un token JWT que "identifica" a un usuario. El token no guarda la
// contraseña ni nada sensible, solo el id, y expira en 2 horas.
const generarToken = (usuarioId : number) => {
    return jwt.sign ({id: usuarioId}, "mi_clave_secreta",{  expiresIn: "2h" });
};

// POST /api/auth/registro. 
// Crea una cuenta nueva (un registro en Usuario) con la contraseña encriptada,
// y devuelve un token para que la persona quede logueada automáticamente.
export const registro = async (req: Request, res: Response) => {
    try{
        const {nombre, correo, telefono, password} = req.body;

        if(!nombre || !correo || !password){
            return res.status(400).json({error: "Nombre, correo y constraseña son obligatorios"});
        }

        if (!correoValido(correo)){
            return res.status(400).json({error:"Formato de correo invalido"});
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
        }

        //Se verifica si el correo ya existe
        const existe = await prisma.usuario.findUnique({where: {correo}});

        if(existe){
            return res.status(409).json({error:"El correo ya està registrado."});
        }

        // Encriptamos la contraseña antes de guardarla.
        const passswordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = await prisma.usuario.create({
            data:{
                nombre,
                correo,
                telefono: telefono || null,
                password: passswordHash
            },
        });

        const token = generarToken(nuevoUsuario.id);

        return res.status(201).json({
            token, 
            usuario: { 
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo
            },
        });
    }catch (error){
        console.error ("Error al registrar usuario", error);
        return res.status(500).json({error:"Error al registrar usuario"});

    }
};

// POST /api/auth/login
// Verifica correo + contraseña y, si son correctos, devuelve un token nuevo.
export const login = async (req: Request, res: Response) => {
try{
    const { correo, password }=req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: "Los campos correo y contrasena son obligatorios" });
    }

    const usuario = await prisma.usuario.findUnique({ where:{ correo } });

    if(!usuario) {
        return res.status(401).json({ message: "Usuario no encontrado" });
    }

    if(!usuario.password) {
        return res.status(401).json({ message: "Usuario no tiene contraseña establecida" });
    }

    // bcrypt.compare encripta la contraseña recibida con el mismo algoritmo
    // y compara el resultado contra el hash guardado
    const coincide = await bcrypt.compare(password, usuario.password);

    if(!coincide) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = generarToken(usuario.id);

    return res.status(200).json({token,
        usuario:{
            id: usuario.id,
            nombre: usuario.nombre,
            correo:usuario.correo
        },
    });
}catch (error){
    console.error ("Error al iniciar sesión:", error);
    return res.status(500).json({error:"Error al iniciar sesión"});
}
};