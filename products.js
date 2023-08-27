const getConnection = require('./db')

async function getProducts({ caracteristica = '', modelo = '' }) {
console.log(modelo);
    try {
        const connection = await getConnection();
        const regex = `.*${modelo.replace(/\s+/g, '.*')}.*`;

        const sql = `SELECT * FROM productos WHERE nombre REGEXP '${regex}'`;
        const [rows, fields] = await connection.execute(sql);
        console.log(rows);
        return rows;

    } catch (err) {
        console.error(`Error al ejecutar la consulta: ${err}`);
    }
}


module.exports = getProducts;