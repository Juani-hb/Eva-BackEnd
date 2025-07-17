import fs from "fs";
import cloudinary from "../upload.js";
import { postVideo } from "../services/videos.services.js";

const subirVideo = async (req, res) => {
  try {
    console.log("Entró al controller subirVideo");

    console.log("req.userId:", req.userId);
    console.log("req.file:", req.file);
    console.log("horainicio:", req.body.horainicio);
    console.log("horafinal:", req.body.horafinal);

    const id_usuario = req.userId;
    const archivo = req.file?.path;
    const horainicio = req.body.horainicio;
    const horafinal = req.body.horafinal;

    console.log("Campos procesados:", { id_usuario, archivo, horainicio, horafinal });

    if (!id_usuario || !archivo || !horainicio || !horafinal) {
      console.log("Faltan campos:", { id_usuario, archivo, horainicio, horafinal });

      // Eliminar el archivo si ya fue subido temporalmente
      if (archivo && fs.existsSync(archivo)) {
        fs.unlinkSync(archivo);
      }

      return res.status(400).json({ message: "Faltan campos: usuario, archivo o horas." });
    }

    const extension = archivo.split('.').pop().toLowerCase();
    const extensionesPermitidas = ['mp4', 'avi', 'mov', 'mkv'];

    console.log("Extensión detectada:", extension);

    if (!extensionesPermitidas.includes(extension)) {
      console.log("Extensión no permitida:", extension);
      
      if (fs.existsSync(archivo)) {
        fs.unlinkSync(archivo);
      }

      return res.status(400).json({ error: "Solo se permiten videos (mp4, avi, mov, mkv)." });
    }

    console.log("Subiendo a Cloudinary...");
    const result = await cloudinary.uploader.upload(archivo, {
      resource_type: 'video',
      folder: 'videos'
    });
    console.log("Subida a Cloudinary OK:", result.secure_url);

    const ruta = result.secure_url;

    console.log("Guardando en base de datos...");
    const guardado = await postVideo(id_usuario, ruta, horainicio, horafinal);

    // Intentar eliminar archivo local temporalmente
    if (fs.existsSync(archivo)) {
      fs.unlinkSync(archivo);
      console.log("Archivo local eliminado");
    }

    if (!guardado) {
      console.log("Error al guardar en la base de datos");
      return res.status(500).json({ error: "Error al guardar en la base de datos." });
    }

    console.log("Video subido y guardado correctamente");

    res.status(201).json({
      mensaje: "Video subido y guardado correctamente",
      ruta: ruta
    });

  } catch (error) {
    console.error("Error al subir video:", error);

    // Intentar eliminar el archivo si quedó colgado
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log("Archivo temporal eliminado tras error");
      } catch (err) {
        console.error("Error al eliminar archivo temporal:", err.message);
      }
    }

    res.status(500).json({ error: "Error interno al procesar el video: " + error.message });
  }
};

export const videoController = { subirVideo };
