import db from '../db.js';

export const verificarLogin = async (email, contra, usuario) => {
  const result = await db.query(
    'SELECT * FROM "User" WHERE email = $1 AND contra = $2 AND usuario = $3' ,
    [email, contra, usuario]
  );

  return result.rows.length > 0;
};
