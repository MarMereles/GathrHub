import { Router } from "express";
import {
  obtenerReservas, crearReserva, actualizarReserva,eliminarReserva,
  obtenerReservaById,
} from "../controllers/reservaController";

const router = Router();

router.get("/", obtenerReservas);
router.get("/:id", obtenerReservaById)
router.post("/", crearReserva);
router.put("/:id", actualizarReserva);
router.delete("/:id", eliminarReserva);

export default router;
