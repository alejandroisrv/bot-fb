const createConnection = require('./db');



// Función para buscar una respuesta en la base de datos
const getResponseByIntents = async (intent) => {
    console.log("intents", intent);
    // Realizar una consulta SQL para buscar la respuesta correspondiente a la intención
    try {
        const connection = await createConnection();
        const sql = `SELECT respuesta FROM respuestas_bots WHERE intents = '${intent}' ORDER BY RAND() LIMIT 1`;
        const [rows, fields] = await connection.execute(sql)

        console.log(rows[0].respuesta)
        return rows[0].respuesta

    } catch (err) {
        console.error(`Error al ejecutar la consulta: ${err}`);
    }
}

module.exports = getResponseByIntents;