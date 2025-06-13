import jwt from "jsonwebtoken";
import db from "../db.js";
import { verificarLogin, registrarUsuario } from '../services/user.service.js';

export const login = async (req, res) => {
  const { email, contra } = req.body;

  if (!email || !contra) {
    return res.status(400).json({ error: "Faltan campos." });
  }

  const usuario = await verificarLogin(email, contra);
  console.log(usuario);
  
  if (usuario) {
    const token = jwt.sign({ id: usuario.id }, "secret", { expiresIn: "30m" });

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

// 🔹 Nuevo GET para obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "User"');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios." });
  }
};
