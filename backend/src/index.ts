import express from "express";
import cors from "cors";
import { logger } from "./middlewares/logger";

import salonRoutes from "./routes/salonRoutes";
import reservaRoutes from "./routes/reservaRoutes";
import usuarioRoutes from "./routes/usuarioRoutes";
import authRoutes from "./routes/authRoutes";
import weatherRoutes from "./routes/weatherRoutes";



const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

//middleware para registrar los movimientos en el servidor
app.use(logger);

// Rutas principales de la API
app.use("/api/salones", salonRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/reservas", reservaRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/clima", weatherRoutes);

// Ruta de verificación de estado del servidor
app.get("/", (req, res) => {
  res.json({ mensaje: "API de GathrHub funcionando correctamente " });
});

//Se escucha en el puerto 4000
app.listen(4000, () => {
console.log("Servidor en http://localhost:4000");
});