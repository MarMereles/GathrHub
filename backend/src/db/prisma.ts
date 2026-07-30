import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";

export const prisma = new PrismaClient(); //un objeto de prisma client que nos permite interactuar con la base de datos
//Para poder manejar los metodos apropiados usando las operaciones CRUD