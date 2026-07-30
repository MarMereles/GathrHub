import {Router} from 'express';
import { actualizarSalon, crearSalon, eiliminarSalon, obtenerSalonById, obtenerSalones } from '../controllers/salonController';



const router = Router();

// Ruta para obtener todos los salones
router.get("/", obtenerSalones);

// Ruta para obtener un salón por su ID
router.get("/:id", obtenerSalonById);

// Ruta para crear un nuevo salón
router.post("/", crearSalon);

//ruta para actualizar un salon
router.put("/:id", actualizarSalon);

//ruta para eliminar un salon
router.all(":id", eiliminarSalon)


export default router;