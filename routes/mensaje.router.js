import express from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js"; // tu middleware tal cual lo pegaste
import {
  crearMensaje,
  listarMensajes,
  obtenerUltimoMensaje,
} from "../controllers/mensaje.controller.js";

const router = express.Router();

router.post("/", verifyToken, crearMensaje);
router.get("/", verifyToken, listarMensajes);
router.get("/ultimo", verifyToken, obtenerUltimoMensaje);

export default router;