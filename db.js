const mysql = require('mysql2/promise');

// Crear una conexión a la base de datos
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'electriserviceup_tecnowins',
//     password: '.%VFo$&fjEj_',
//     database: 'electriserviceup_tecnowins'
// });
async function createConnection() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'tecnowins',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })
    // Verificar si la conexión es exitosa
    console.log('Conexión exitosa a la base de datos');
    return connection

}

module.exports = createConnection;