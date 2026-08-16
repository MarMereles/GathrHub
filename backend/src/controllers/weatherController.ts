import { obtenerClima } from "../services/weatherServices";
import { Request, Response } from "express";

// GET /api/clima?ciudad=Asuncion
export const consultarClima = async (req: Request, res: Response) => {
  try {
    const { ciudad } = req.query;

    if (!ciudad) {
      return res
        .status(400)
        .json({ error: "El parámetro ciudad es obligatorio" });
    }

    const datos = await obtenerClima(ciudad as string);

    res.json(datos);
  } catch (error) {
    console.error("Error al consultar el clima:", error);
    res.status(404).json({ error: "Ciudad no encontrada" });
  }
};
