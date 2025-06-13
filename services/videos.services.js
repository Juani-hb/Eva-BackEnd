import db from "../db.js"

export const postVideo = async (id_usuario, ruta, horainicio, horafinal) => {
    try {
        const result = await db.query(`
            INSERT INTO video (id_usuario, ruta, horainicio, horafinal) VALUES ($1, $2, $3, $4)`, [id_usuario, ruta, horainicio, horafinal]);
        return result;

    } catch (error) {
        console.error("Error al guardar diagnostico:", error);
        throw new Error("No se pudo guardar el diagnostico.");
    }
};