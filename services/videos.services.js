import db from "../db.js";

export const postVideo = async (id_usuario, ruta, horainicio, horafinal) => {
  try {
    const result = await db.query(`
      INSERT INTO video (id_usuario, ruta, horainicio, horafinal)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [id_usuario, ruta, horainicio, horafinal]);

    if (result.rows.length === 0) {
      throw new Error("No se obtuvo el ID del video insertado.");
    }

    return result.rows[0]; // devuelve: { id: ... }

  } catch (error) {
    console.error("Error al guardar video:", error);
    throw new Error("No se pudo guardar el video en la base de datos.");
  }
};
