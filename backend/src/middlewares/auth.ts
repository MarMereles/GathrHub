//meddleware para gestionar el inico de sesion con token.
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verificarToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //peticion header autorizacion
  const token = req.headers.authorization?.split(" ")[1]; //obtenemos el token del header de la peticion

  if (!token) {
    return res.status(401).json({
      mensaje: "Acceso denegado. Token requerido.",
    });
  }

  try {
    jwt.verify(token, "mi_clave_secreta"); //verificamos el token con la clave secreta
    next();
  } catch {
    return res.status(401).json({ mensaje: "Token inválido." });
  }
};
