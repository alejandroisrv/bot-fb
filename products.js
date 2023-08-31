const getConnection = require('./db')


async function getProduct({ modelo = '' }) {
    try {
        console.log("modelo", modelo);

        const connection = await getConnection();

        let sql = `SELECT computadoras.*, productos.*, procesadores.descripcion as p_descripcion, procesadores.serie, procesadores.gen FROM productos JOIN computadoras ON computadoras.id = item_id JOIN procesadores ON computadoras.procesador_id = procesadores.id WHERE estado = 1 `;

        if (modelo != undefined) {
            let regex = `.*${modelo.replace(/\s+/g, '.*')}.*`;
            sql += `and nombre REGEXP '${regex}'`;
        }

        const [rows, fields] = await connection.execute(sql);
        console.log(rows);
        return rows;

    } catch (err) {
        console.error(`Error al ejecutar la consulta: ${err}`);
    }
}

async function getProductsByCaracteristica({ cantidad_ram, procesador }) {
    try {

        console.log({ cantidad_ram, procesador });
        const connection = await getConnection();

        let sql = `SELECT computadoras.*, productos.*, procesadores.descripcion as p_descripcion, procesadores.serie, procesadores.gen FROM productos JOIN computadoras ON computadoras.id = item_id JOIN procesadores ON computadoras.procesador_id =  procesadores.id WHERE estado = 1 `;

        if (cantidad_ram != '' && cantidad_ram != undefined) {
            sql += `AND memoria_ram LIKE '${cantidad_ram.split(' ')[0]}%'`
        }

        if (procesador != '' && procesador != undefined) {
            sql += ` AND procesadores.descripcion LIKE '${procesador.split(' ')[0]}'`
        }

        console.log(sql);

        const [rows, fields] = await connection.execute(sql);
        console.log(rows);
        return rows;

    } catch (err) {
        console.error(`Error al ejecutar la consulta: ${err}`);
    }
}




module.exports = {
    getProduct,
    getProductsByCaracteristica
};