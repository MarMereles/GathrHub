import { Router } from "express";
import { obtenerReservas, crearReserva, actualizarReserva,eliminarReserva, obtenerReservaById 
} from "../controllers/reservaController";
import { verificarToken } from "../middlewares/auth";

const router = Router();
// Todas las operaciones sobre reservas requieren estar logueado
//Ruta para obtener reservas, reservas por Id, crear, actualizar y eliminar reservas respectivamente
router.get("/", verificarToken, obtenerReservas);
router.get("/:id", verificarToken, obtenerReservaById)
router.post("/", verificarToken, crearReserva);
router.put("/:id", verificarToken, actualizarReserva);
router.delete("/:id", verificarToken, eliminarReserva);

export default router;
