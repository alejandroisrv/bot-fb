const mysql = require('mysql2/promise');
const logger = require('./logger');

async function createConnection() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: process.env.USER_DB || 'root',
        password: process.env.USER_PASSWORD || 'root',
        database: process.env.DB_NAME || 'tecnowins',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })
    // Verificar si la conexión es exitosa
    logger.info('Conexión exitosa a la base de datos');
    return connection

}

module.exports = createConnection;