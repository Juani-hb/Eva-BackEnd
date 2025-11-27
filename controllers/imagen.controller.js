import fs from "fs";
import cloudinary from "../upload.js";
import db from "../db.js";

export const guardarDeteccion = async (req, res) => {
  try {
    // ❌ ya no usamos userId ni token
    if (!req.file?.path) {
      return res.status(400).json({ message: "No se adjuntó ninguna imagen." });
    }

    const imageFile  = req.file.path;
    const extension  = imageFile.split(".").pop().toLowerCase();
    const permitidas = ["png", "jpeg", "jpg"];

    if (!permitidas.includes(extension)) {
      try { fs.unlinkSync(imageFile); } catch {}
      return res.status(400).json({ message: "Extensión no permitida. Solo PNG, JPEG y JPG." });
    }

    // Subimos a Cloudinary
    const upload = await cloudinary.uploader.upload(imageFile, { folder: "analisis" });
    const imageUrl = upload.secure_url;

    // Guardamos en la BD SIN user_id
    const sql = `
      INSERT INTO public.deteccion (imagen, hora)
      VALUES ($1, NOW())
      RETURNING id, imagen, hora
    `;
    const { rows } = await db.query(sql, [imageUrl]);

    // Borramos el archivo temporal
    try { fs.unlinkSync(imageFile); } catch {}

    return res.status(201).json({
      message: "Detección creada correctamente.",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error al guardar detección:", error);
    if (req?.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const listarDetecciones = async (req, res) => {
  try {
    // ❌ ya no usamos req.userId ni filtramos por usuario

    const page = Math.max(1, parseInt(req.query.page ?? "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize ?? "20", 10)));
    const offset = (page - 1) * pageSize;

    // total de detecciones (todas)
    const { rows: c } = await db.query(
      `SELECT COUNT(*)::int AS count FROM public.deteccion`
    );
    const total = c[0]?.count ?? 0;

    // listado paginado (todas)
    const { rows } = await db.query(
      `SELECT id, imagen, hora
         FROM public.deteccion
        ORDER BY hora DESC
        LIMIT $1 OFFSET $2`,
      [pageSize, offset]
    );

    return res.json({ page, pageSize, total, data: rows });
  } catch (err) {
    console.error("Error al listar detecciones:", err);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
