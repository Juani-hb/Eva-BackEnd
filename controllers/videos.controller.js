import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import { postVideo } from "../services/videos.services.js";

const subirVideo = async (req, res) => {
  const id_usuario = req.userId;
  const archivo = req.file?.path;
  const horainicio = req.body.horainicio;
  const horafinal = req.body.horafinal;

  console.log(id_usuario, archivo, horainicio, horafinal);
  if (!id_usuario || !archivo || !horainicio || !horafinal) {
    return res.status(400).json({ message: "Faltan campos: usuario, archivo o horas." });
  }

  const extension = archivo.split('.').pop().toLowerCase();
  const extensionesPermitidas = ['mp4', 'avi', 'mov', 'mkv'];

  if (!extensionesPermitidas.includes(extension)) {
    fs.unlinkSync(archivo);
    return res.status(400).json({ error: "Solo se permiten videos (mp4, avi, mov, mkv)." });
  }

  try {
    const result = await cloudinary.uploader.upload(archivo, {
      resource_type: 'video',
      folder: 'videos'
    });

    const ruta = result.secure_url;

    const guardado = await postVideo(id_usuario, ruta, horainicio, horafinal);

    fs.unlinkSync(archivo);

    if (!guardado) {
      return res.status(500).json({ error: "Error al guardar en la base de datos." });
    }

    res.status(201).json({
      mensaje: "Video subido y guardado correctamente 🎥",
      ruta: ruta
    });

  } catch (error) {
    console.error("Error al subir video:", error);
    res.status(500).json({ error: error.message });
  }
};

export { subirVideo };
