import jwt from "jsonwebtoken";
import db from "../db.js";
import { verificarLogin, registrarUsuario } from "../services/user.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = "30m";

export const login = async (req, res) => {
  const { email, contra } = req.body;

  if (!email || !contra) {
    return res.status(400).json({ error: "Faltan campos." });
  }

  const usuario = await verificarLogin(email, contra);
  console.log(usuario);

  if (usuario) {
    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({ mensaje: "Login exitoso", token });
  } else {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }
};

export const registro = async (req, res) => {
  const { email, contra, usuario } = req.body;

  if (!email || !contra || !usuario) {
    return res.status(400).json({ error: "Faltan campos." });
  }

  try {
    // Crea el usuario (tu service puede devolver un objeto, un row o un boolean)
    const nuevoUsuario = await registrarUsuario(email, contra, usuario);

    // Intentamos obtener el ID de distintas formas según lo que devuelva el service
    let userId =
      nuevoUsuario?.id ??
      nuevoUsuario?.rows?.[0]?.id ??
      nuevoUsuario?.user?.id ??
      null;

    // Fallback: si aún no tenemos el id, lo buscamos por email
    if (!userId) {
      const { rows } = await db.query('SELECT id FROM "User" WHERE email = $1 LIMIT 1', [email]);
      userId = rows?.[0]?.id || null;
    }

    if (!userId) {
      // Si aún así no conseguimos el id, devolvemos 500 para que lo revises
      return res.status(500).json({ error: "No se pudo obtener el ID del usuario recién creado." });
    }

    // Generamos el token igual que en login
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(201).json({
      mensaje: "Usuario creado",
      usuario: { id: userId, email, usuario },
      token, // ✅ token también en el registro
    });
  } catch (err) {
    console.error("Error al registrar:", err);
    return res.status(500).json({ error: "Error al registrar usuario." });
  }
};

// 🔹 GET: obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "User"');
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return res.status(500).json({ error: "Error al obtener usuarios." });
  }
};

export const eliminarUsuario = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.query('DELETE FROM "User" WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    return res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ error: "Error al eliminar usuario." });
  }
};
