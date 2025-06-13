import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {

    try{
        if(!req.headers.authorization)
            return res.status(401).json({message: "No puede acceder."});

        const token = req.headers.authorization.split(" ")[1];

        if (!token) 
            return res.status(400).json({message: "Formato invalido de token."});

        const payload = await jwt.verify(token, "secret");

        if (!payload.id) 
            return res.status(400).json({ message: "El token no contiene un ID de usuario."});
    
        req.id = parseInt(payload.id);

        next();

    } catch (error){
        res.status(500).json({ message: error.message });
    }

};


