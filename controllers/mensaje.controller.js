import {
  crearMensajeService,
  listarMensajesService,
  obtenerUltimoMensajeService,
} from "../services/mensaje.service.js";


const COMANDOS_VALIDOS = new Set([
  "abrir_puerta",
  "cerrar_puerta",
  "abrir_porton",
  "cerrar_porton",
  "activar_alarma",
  "desactivar_alarma",
  "bloquear_accesos",
  "desbloquear_accesos",
  "encender_luces",
  "apagar_luces",
]);

export const crearMensaje = async (req, res) => {
  try {
    const { comando, hora } = req.body;
    const idusuario = req.userId; 

    if (!comando) {
      return res.status(400).json({ message: "Falta 'comando'." });
    }
    if (!idusuario) {
      return res.status(401).json({ message: "Token inválido o faltante." });
    }

    if (!COMANDOS_VALIDOS.has(comando)) {
      return res.status(400).json({
        message: "Comando no permitido.",
        permitido: Array.from(COMANDOS_VALIDOS),
      });
    }

   
    let horaDate = null;
    if (hora) {
      horaDate = new Date(hora);
      if (isNaN(horaDate.getTime())) {
        return res.status(400).json({ message: "Formato de 'hora' inválido (ISO)." });
      }
    }

    const row = await crearMensajeService({ comando, hora: horaDate, idusuario });
    return res.status(201).json({ message: "Comando registrado", data: row });
  } catch (err) {
    console.error("crearMensaje error:", err);
    return res.status(500).json({ message: "Error interno" });
  }
};

export const listarMensajes = async (req, res) => {
  try {
    const idusuario = req.userId; 
    const limit = Math.min(parseInt(req.query.limit ?? "20", 10), 200);
    const rows = await listarMensajesService({ idusuario, limit });
    return res.json(rows);
  } catch (err) {
    console.error("listarMensajes error:", err);
    return res.status(500).json({ message: "Error interno" });
  }
};

export const obtenerUltimoMensaje = async (req, res) => {
  try {
    const idusuario = req.userId;
    const row = await obtenerUltimoMensajeService({ idusuario });
    return res.json(row ?? null);
  } catch (err) {
    console.error("obtenerUltimoMensaje error:", err);
    return res.status(500).json({ message: "Error interno" });
  }
};