import { Router } from "express";
import { obtenerUsuarios, obtenerUsuarioById, crearUsuario, actualizarUsuario, eliminarUsuario } from "../controllers/usuarioController";

const router = Router();

router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuarioById);
router.post("/", crearUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);

export default router;