import db from '../db.js';

export const verificarLogin = async (email, contra) => {
  const result = await db.query(
    'SELECT * FROM "User" WHERE email = $1 AND contra = $2 RETURN id',
    [email, contra]
  );

  return result.rows[0]; // 👈 devuelve el usuario si existe
};

export const registrarUsuario = async (email, contra, usuario) => {
  const result = await db.query(
    'INSERT INTO "User" (email, contra, usuario) VALUES ($1, $2, $3) RETURNING *',
    [email, contra, usuario]
  );

  return result.rows[0];
};

