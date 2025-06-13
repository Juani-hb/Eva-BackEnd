import jwt from "jsonwebtoken";
import { verificarLogin, registrarUsuario } from '../services/user.service.js';

export const login = async (req, res) => {
  const { email, contra } = req.body;

  if (!email || !contra) {
    return res.status(400).json({ error: "Faltan campos." });
  }

  const usuario = await verificarLogin(email, contra);

  if (usuario) {
    console.log(id_usuario, id);
    const token = jwt.sign({ id: usuario.id}, "secret", { expiresIn: "30m" });

    res.json({
      mensaje: "Login exitoso ✅",
      token
    });
  } else {
    res.status(401).json({ error: "Credenciales inválidas" });
  }
};

export const registro = async (req, res) => {
  const { email, contra, usuario } = req.body;

  if (!email || !contra || !usuario) {
    return res.status(400).json({ error: "Faltan campos." });
  }

  try {
    const nuevoUsuario = await registrarUsuario(email, contra, usuario);
    res.status(201).json({ mensaje: "Usuario creado ✅", usuario: nuevoUsuario });
  } catch (err) {
    console.error("Error al registrar:", err);
    res.status(500).json({ error: "Error al registrar usuario." });
  }
};
