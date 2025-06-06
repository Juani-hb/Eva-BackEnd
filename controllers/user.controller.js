import { verificarLogin } from '../services/user.service.js';

export const login = async (req, res) => {
  const { email, contra, usuario } = req.body;

  if (!email || !contra) {
    return res.status(400).json({ error: "Faltan campos." });
  }

  const valido = await verificarLogin(email, contra, usuario);

  if (valido) {
    res.json({ mensaje: "Login exitoso ✅" });
  } else {
    res.status(401).json({ error: "Credenciales inválidas" });
  }
};
