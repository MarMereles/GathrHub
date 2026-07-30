import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

const ESTADOS_VALIDOS = ["pendiente", "confirmada", "cancelada"];

// Se verifica si dos rangos horarios (formato "HH:MM") se superponen
const seSuperponen = (inicioA: string, finA: string, inicioB: string, finB: string) => {
  return inicioA < finB && finA > inicioB;  //Si el evento A empeiza antes que el B termine, y el evento A termina despues del que B empiece
};

// Revisa si ya existe una reserva activa para el mismo salón, misma fecha,
// con un horario que se cruza con el solicitado. Excluye reservas canceladas
// y, opcionalmente, la propia reserva que se está editando (reservaIdExcluir).
const existeConflictoDeHorario = async (
  salonId: number,
  fecha: Date,
  horaInicio: string,
  horaFin: string,
  reservaIdExcluir?: number
) => {
  const reservasDelDia = await prisma.reserva.findMany({
    where: {
      salonId,
      fecha,
      estado: { not: "cancelada" },
      ...(reservaIdExcluir ? { id: { not: reservaIdExcluir } } : {}),
    },
  });

  return reservasDelDia.some((reserva: { horaInicio: string; horaFin: string }) =>
    seSuperponen(horaInicio, horaFin, reserva.horaInicio, reserva.horaFin) //Se compara el nuevo horario deseado contra el horario de la reserva que se está revisando en ese turno
  );
};


//GET /api/reservas
// Obtiene el listado de reservas, incluyendo la información del salón y del usuario relacionados.
// Admite filtros opcionales por salonId, usuarioId y estado (query params).
export const obtenerReservas = async (req: Request, res: Response) => {
    try{
        const { salonId, usuarioId, estado } = req.query;

        const reservas = await prisma.reserva.findMany({
          where: {
            salonId: salonId !== undefined ? Number(salonId) : undefined,
            usuarioId: usuarioId !== undefined ? Number(usuarioId) : undefined,
            estado: estado !== undefined ? String(estado) : undefined,
          },
          include: {
            salon: true,
            usuario: true,
          },
          orderBy: { fecha: "asc" },
        });
        return res.status(200).json(reservas);
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Erro al obtener reservas"});
    }
}

// GET /api/reservas/:id
export const obtenerReservaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) },
      include: { salon: true, usuario: true },
    });

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    return res.status(200).json(reserva);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener la reserva" });
  }
};

//POST /api/reservas
// Crea una nueva reserva, validando datos, existencia de relaciones y conflictos de horario
export const crearReserva = async (req: Request, res: Response) => {
   try {
    const { salonId, usuarioId, fecha, horaInicio, horaFin, estado, notas } = req.body;

    if (!salonId || !usuarioId || !fecha || !horaInicio || !horaFin) {
      return res.status(400).json({
        error: "Los campos salonId, usuarioId, fecha, horaInicio y horaFin son obligatorios",
      });
    }

    if (horaInicio >= horaFin) {
      return res.status(400).json({ error: "La hora de inicio debe ser anterior a la hora de fin" });
    }

    if (estado !== undefined && !ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ error: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(", ")}` });
    }

    // Verificar que el salón y el usuario existan antes de crear la relación
    const salon = await prisma.salon.findUnique({ where: { id: Number(salonId) } });
    if (!salon) {
      return res.status(404).json({ error: "El salón indicado no existe" });
    }

    const usuario = await prisma.usuario.findUnique({ where: { id: Number(usuarioId) } });
    if (!usuario) {
      return res.status(404).json({ error: "El usuario indicado no existe" });
    }

    const fechaReserva = new Date(fecha);

    const hayConflicto = await existeConflictoDeHorario(Number(salonId), fechaReserva, horaInicio, horaFin);
    if (hayConflicto) {
      return res.status(409).json({
        error: "Ya existe una reserva para ese salón que se superpone con el horario solicitado",
      });
    }

    const nuevaReserva = await prisma.reserva.create({
      data: {
        salonId: Number(salonId),
        usuarioId: Number(usuarioId),
        fecha: fechaReserva,
        horaInicio,
        horaFin,
        estado: estado || "pendiente",
        notas: notas || null,
      },
      include: { salon: true, usuario: true },
    });

    return res.status(201).json(nuevaReserva);
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Error al crear reserva"})
    }
};


//PUT api/reservas/:id
// Actualiza una reserva existente, repitiendo las mismas validaciones que en la creación
export const actualizarReserva = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { salonId, usuarioId, fecha, horaInicio, horaFin, estado, notas } = req.body;

    const reservaExistente = await prisma.reserva.findUnique({ where: { id: Number(id) } });
    if (!reservaExistente) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    if (!salonId || !usuarioId || !fecha || !horaInicio || !horaFin) {
      return res.status(400).json({
        error: "Los campos salonId, usuarioId, fecha, horaInicio y horaFin son obligatorios",
      });
    }

    if (horaInicio >= horaFin) {
      return res.status(400).json({ error: "La hora de inicio debe ser anterior a la hora de fin" });
    }

    if (estado !== undefined && !ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ error: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(", ")}` });
    }

    const salon = await prisma.salon.findUnique({ where: { id: Number(salonId) } });
    if (!salon) {
      return res.status(404).json({ error: "El salón indicado no existe" });
    }

    const usuario = await prisma.usuario.findUnique({ where: { id: Number(usuarioId) } });
    if (!usuario) {
      return res.status(404).json({ error: "El usuario indicado no existe" });
    }

    const fechaReserva = new Date(fecha);

    const hayConflicto = await existeConflictoDeHorario(
      Number(salonId),
      fechaReserva,
      horaInicio,
      horaFin,
      Number(id)
    );
    if (hayConflicto) {
      return res.status(409).json({
        error: "Ya existe una reserva para ese salón que se superpone con el horario solicitado",
      });
    }

    const reservaActualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: {
        salonId: Number(salonId),
        usuarioId: Number(usuarioId),
        fecha: fechaReserva,
        horaInicio,
        horaFin,
        estado: estado || reservaExistente.estado,
        notas: notas || null,
      },
      include: { salon: true, usuario: true },
    });
    return res.status(200).json(reservaActualizada);
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Error al actualizar reserva"});
    }
};

//DELETE /api/reservas/:id
export const eliminarReserva = async (req: Request, res: Response) => {
   try {
    const { id } = req.params;

    const reservaExistente = await prisma.reserva.findUnique({ where: { id: Number(id) } });

    if (!reservaExistente) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    await prisma.reserva.delete({ where: { id: Number(id) } });

    return res.status(200).json({ mensaje: "Reserva eliminada correctamente" });
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Error al eliminar reserva"})
    }
};