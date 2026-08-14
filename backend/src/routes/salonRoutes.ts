import {Router} from 'express';
import { actualizarSalon, crearSalon, eliminarSalon, obtenerSalonById, obtenerSalones } from '../controllers/salonController';
import { verificarToken } from "../middlewares/auth";


const router = Router();

//Cualquiera puede ver los salones, sin estar logueado
// Ruta para obtener todos los salones
router.get("/", obtenerSalones);
// Ruta para obtener un salón por su ID
router.get("/:id", obtenerSalonById);


//Para crear, editar o eliminar un salon, hay que estar autenticado.
// Ruta para crear un nuevo salón
router.post("/",verificarToken, crearSalon);
//ruta para actualizar un salon
router.put("/:id",verificarToken, actualizarSalon);
//ruta para eliminar un salon
router.delete("/:id",verificarToken, eliminarSalon)


export default router;