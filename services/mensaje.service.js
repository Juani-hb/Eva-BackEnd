import db from "../db.js";

/**
 * Inserta en 'mensaje'. Si 'hora' es null, Postgres pone NOW() (TIMESTAMPTZ).
 */
export const crearMensajeService = async ({ comando, hora, idusuario }) => {
  if (hora) {
    const { rows } = await db.query(
      `INSERT INTO mensaje (comando, hora, idusuario)
       VALUES ($1, $2, $3)
       RETURNING id, comando, hora, idusuario;`,
      [comando, hora, idusuario]
    );
    return rows[0];
  } else {
    const { rows } = await db.query(
      `INSERT INTO mensaje (comando, idusuario)
       VALUES ($1, $2)
       RETURNING id, comando, hora, idusuario;`,
      [comando, idusuario]
    );
    return rows[0];
  }
};

export const listarMensajesService = async ({ idusuario, limit = 20 }) => {
  const { rows } = await db.query(
    `SELECT id, comando, hora, idusuario
     FROM mensaje
     WHERE idusuario = $1
     ORDER BY hora DESC
     LIMIT $2;`,
    [idusuario, limit]
  );
  return rows;
};

export const obtenerUltimoMensajeService = async ({ idusuario }) => {
  const { rows } = await db.query(
    `SELECT id, comando, hora, idusuario
     FROM mensaje
     WHERE idusuario = $1
     ORDER BY hora DESC
     LIMIT 1;`,
    [idusuario]
  );
  return rows[0];
};