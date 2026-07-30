import type { Salon } from "./Salon";
import type { Usuario } from "./Usuario";

// "estado" siempre es uno de estos tres valores
export type EstadoReserva = "pendiente" | "confirmada" | "cancelada";

export interface Reserva {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: EstadoReserva;
  notas: string | null;
  salonId: number;
  usuarioId: number;
  // El backend incluye estos dos objetos completos gracias al "include" de Prisma
  salon: Salon;
  usuario: Usuario;
  creadoAt: string;
}
