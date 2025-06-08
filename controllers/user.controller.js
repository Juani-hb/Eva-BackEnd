import { verificarLogin } from '../services/user.service.js';

export const login = async (req, res) => {
  const { email, contra } = req.body;

  if (!email || !contra) {
    return res.status(400).json({ error: "Faltan campos." });
  }

  const valido = await verificarLogin(email, contra);

  if (valido) {
    res.json({ mensaje: "Login exitoso ✅" });
  } else {
    res.status(401).json({ error: "Credenciales inválidas" });
  }
};

import { registrarUsuario } from '../services/user.service.js';

export const registro = async (req, res) => {
  const { email, contra, usuario } = req.body;

  if (!email || !contra || !usuario) {
    return res.status(400).json({ error: "Faltan campos." });
  }

  try {
    const nuevoUsuario = await registrarUsuario(email, contra, usuario);
    res.status(201).json({ mensaje: "Usuario creado ✅", usuario: nuevoUsuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar usuario." });
  }
};