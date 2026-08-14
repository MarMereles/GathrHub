import { Router } from "express";
import { obtenerUsuarios, obtenerUsuarioById, actualizarUsuario, eliminarUsuario } from "../controllers/usuarioController";
import { verificarToken } from "../middlewares/auth";


const router = Router();

//La creacion de usuario se realiza en /api/auth/registro con contraseña
//El resto de las operaciones sobre usuarios (obtener lista de usuarios, usuarios por Id, actualizar y eliminar usuarios)
//requiere estar logueado
router.get("/", verificarToken, obtenerUsuarios); //Se verifica token para obtener la lista de usuarios
router.get("/:id", verificarToken, obtenerUsuarioById); //Se verifica token para obtener ususario por id
router.put("/:id", verificarToken, actualizarUsuario);
router.delete("/:id",verificarToken, eliminarUsuario);

export default router;