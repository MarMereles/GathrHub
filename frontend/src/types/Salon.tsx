export interface Salon {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  ubicacion: string;
  precioPorHora: number;
  disponible: boolean;
  imagenUrl: string | null;
  creadoAt: string;
}