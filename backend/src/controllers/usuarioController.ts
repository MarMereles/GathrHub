import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import bcrypt from "bcrypt";


// Validación básica de formato de correo
const correoValido = (correo: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

// GET /api/usuarios (requiere estar logueado)
// Se obtiene el listado completo de usuarios registrados
export const obtenerUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { creadoAt: "desc" },
    });
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

// GET /api/usuarios/:id (requiere estar logueado)
// Se obtiene un usuario específico, incluyendo sus reservas asociadas
export const obtenerUsuarioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      include: {
        reservas: {
          include: { salon: true },
          orderBy: { fecha: "asc" },
        },
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return res.status(500).json({ error: "Error interno al obtener el usuario" });
  }
};

// PUT /api/usuarios/:id (requiere estar logueado)
// Se actualiza un usuario existente
export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, correo, telefono } = req.body;

    const usuarioExistente = await prisma.usuario.findUnique({ where: { id: Number(id) } });
    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!nombre || !correo) {
      return res.status(400).json({ error: "Los campos nombre y email son obligatorios" });
    }

    if (!correoValido(correo)) {
      return res.status(400).json({ error: "El formato del email no es válido" });
    }

    // Si cambió el email, verificar que no esté en uso por otro usuario
    if (correo !== usuarioExistente.correo) {
      const correoEnUso = await prisma.usuario.findUnique({ where: { correo } });
      if (correoEnUso) {
        return res.status(409).json({ error: "Ya existe un usuario registrado con ese email" });
      }
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { nombre, correo, telefono: telefono || null },
    });

    return res.status(200).json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

// DELETE /api/usuarios/:id
// Se elimina un usuario. Por la relación con onDelete: Cascade, también se eliminan
// automáticamente las reservas asociadas a ese usuario.
export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const usuarioExistente = await prisma.usuario.findUnique({ where: { id: Number(id) } });
    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await prisma.usuario.delete({ where: { id: Number(id) } });

    return res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};




