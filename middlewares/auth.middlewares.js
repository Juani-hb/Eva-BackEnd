import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  console.log("Entró al middleware verifyToken");

  try {
    if (!req.headers.authorization) {
      console.log("No se encontró el header Authorization");
      return res.status(401).json({ message: "No puede acceder." });
    }

    const token = req.headers.authorization.split(" ")[1];
    console.log("Token recibido:", token);

    if (!token) {
      console.log("Token no presente después del split");
      return res.status(400).json({ message: "Formato invalido de token." });
    }

    const payload = await jwt.verify(token, "secret");
    console.log("Token decodificado:", payload);

    if (!payload.id) {
      console.log("Token válido pero no contiene un ID");
      return res.status(400).json({ message: "El token no contiene un ID de usuario." });
    }

    req.userId = parseInt(payload.id);
    console.log("Token OK, userId:", req.userId);

    next();

  } catch (error) {
    console.log("Error al verificar token:", error.message);
    res.status(500).json({ message: error.message });
  }
};



