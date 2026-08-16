import { Router } from "express";
import {consultarClima} from "../controllers/weatherController";
import { verificarToken } from "../middlewares/auth";

const routes = Router();

routes.get("/",verificarToken, consultarClima);

export default routes;


