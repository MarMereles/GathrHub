import{ Request, Response } from 'express';
import { prisma } from "../db/prisma";
// GET /api/salones
// Obtiene el listado completo de salones registrados
export const obtenerSalones = async (req: Request, res: Response) => {
  try {
    const { disponible } = req.query;  

    const salones = await prisma.salon.findMany({
      where: disponible !== undefined ? { disponible: disponible === "true" } : undefined, // Filtra por disponibilidad si se proporciona el parámetro
      include: { reservas: true }, // se incluye reservas para mostrar conteo
      orderBy: { creadoAt: "desc" },                                                       // Ordena los salones por fecha de creación en orden descendente
    });
    return res.status(200).json(salones);
  } catch (error) {
    console.error("Error al obtener los salones:", error);
    return res.status(500).json({ error: "Error interno al obtener los salones" });
  }

};

// GET /api/salones/:id
// Obtiene el detalle de un salón específico
export const obtenerSalonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const salon = await prisma.salon.findUnique({
      where: { id: Number(id) },
      include: {
        reservas: {
          orderBy: { fecha: "asc" },
        },
      },
    });

    if (!salon) {
      return res.status(404).json({ error: "Salón no encontrado" });    //Si no se encuentra un salón con el ID proporcionado, devuelve un error 404 indicando que el salón no fue encontrado
    }

    return res.status(200).json(salon);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener el salón" });
  }
};

// POST /api/salones
// Crea un nuevo registro de salón
export const crearSalon = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, capacidad, ubicacion, precioPorHora, disponible, imagenUrl } = req.body;

    if (!nombre || !descripcion || !capacidad || !ubicacion || !precioPorHora) {   //Verifica si los campos obligatorios están presentes en el cuerpo de la solicitud
      return res.status(400).json({
        error: "Los campos nombre, descripcion, capacidad, ubicacion y precioPorHora son obligatorios",
      });
    }

    const nuevoSalon = await prisma.salon.create({
      data: {
        nombre,
        descripcion,
        capacidad: Number(capacidad),
        ubicacion,
        precioPorHora: Number(precioPorHora),
        disponible: disponible !== undefined ? Boolean(disponible) : true,  //Si no se proporciona el campo disponible, se establece como true por defecto
        imagenUrl: imagenUrl || null,
      },
    });

    return res.status(201).json(nuevoSalon);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear el salón" });
  }
};

//Actualizar registro de salon
// PUT /api/salones/:id
export const actualizarSalon = async (req:Request, res: Response) => {
    try{
        const { id } = req.params;
        const { nombre, descripcion, capacidad, ubicacion, precioPorHora, disponible, imagenUrl } = req.body; 
        const salonExistente = await prisma.salon.findUnique({ where: { id: Number(id) } });
    if (!salonExistente) {
      return res.status(404).json({ error: "Salón no encontrado" });
    }

    if (!nombre || !descripcion || !capacidad || !ubicacion || !precioPorHora) {
      return res.status(400).json({
        error: "Los campos nombre, descripcion, capacidad, ubicacion y precioPorHora son obligatorios",
      });
    }

      const salonActualizado = await prisma.salon.update({
      where: { id: Number(id) },
      data: {
        nombre,
        descripcion,
        capacidad: Number(capacidad),
        ubicacion,
        precioPorHora: Number(precioPorHora),
        disponible: disponible !== undefined ? Boolean(disponible) : salonExistente.disponible,
        imagenUrl: imagenUrl || null,
      },
    });

    return res.status(200).json(salonActualizado);
    }catch(error){
        console.error(error);
        return res.status(500).json({ error: "Error interno al actualizar salón" });
    }
}

//Borrar registro de salon
//DELETE /api/salones/:id
export const eiliminarSalon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const salonExistente = await prisma.salon.findUnique({ where: { id: Number(id) } });
    
    if (!salonExistente) {
      return res.status(404).json({ error: "Salón no encontrado" });
    }

    await prisma.salon.delete({ where: { id: Number(id) } });

    return res.status(200).json({ mensaje: "Salón eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar salón" });
  }
};