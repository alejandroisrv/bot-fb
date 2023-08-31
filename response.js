const createConnection = require('./db');
const ProductModel = require('./products')

const productFormatToWsp = (producto) => (
    `\n*${producto.nombre}*
✅ ${producto.memoria_ram}
✅ ${producto.almacenamiento} ${producto.tipo_almacenamiento}
✅ ${producto.p_descripcion} ${producto.serie}
*💸 $ ${parseFloat(producto.precio_venta).toFixed(0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}*\n`
)

// Buscar la regla correspondiente a la intención y entidades reconocidas por Wit.ai
const getResponseForUser = async (intent, entities) => {
    let responseText = await getResponseByIntents(intent);
    let productos = []


    switch (intent) {
        case 'Consulta_informacion_producto':
            productos = await ProductModel.getProduct({ modelo: entities["bot_producto:bot_producto"][0]['body'] });


            if (productos.length == 0) {
                responseText = null;
                break;
            }

            let product = productos[0]

            const values = {
                MEMORIA_RAM: product.memoria_ram,
                ALMACENAMIENTO: `${product.almacenamiento}`,
                PROCESADOR: `${product.p_descripcion}-${product.serie}`,
                TIPO_ALMACENAMIENTO: product.tipo_almacenamiento
            };

            responseText = responseText.replace(/\{([^}]+)\}/g, (match, key) => values[key] || "");

            break;

        case 'consulta_listado_productos':

            productos = await ProductModel.getProduct({ modelo: '' });

            if (productos.length == 0) {
                responseText = "Por ahora no nos queda nada con esas características, pero podemos notificarte cuando la tengamos disponible"
            } else {
                productos.forEach(p => {
                    responseText += productFormatToWsp(p)
                })
            }

            break;
        case 'consulta_buscando_productos_caracteristica':
            let caracteristicas = {}

            Object.keys(entities).forEach(key => {
                let tipoEntity = key.split(':')
                if (tipoEntity[0] == 'caracteristica_computadora') {
                    caracteristicas[[tipoEntity[1]]] = entities[key][0]['value']
                }
            })

            productos = await ProductModel.getProductsByCaracteristica(caracteristicas)

            if (productos.length == 0) {
                responseText = "Por ahora no nos queda nada con esas características"
            } else {
                productos.forEach(p => {
                    responseText += productFormatToWsp(p)
                })
            }
            break;


        case 'Consulta_de_precios':

            const producto = await ProductModel.getProduct({ modelo: entities["bot_producto:bot_producto"][0]['body'] });

            if (producto.length > 0) {
                let formattedPrice = parseFloat(producto[0].precio_venta).toFixed(0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                responseText = responseText.replace('Y', formattedPrice)
                console.log(responseText);
            } else {
                responseText = null
            }

            break;

        default:
            break;
    }


    return responseText;
}


// Función para buscar una respuesta en la base de datos
const getResponseByIntents = async (intent) => {
    // Realizar una consulta SQL para buscar la respuesta correspondiente a la intención
    try {
        const connection = await createConnection();
        const sql = `SELECT respuesta FROM respuestas_bots WHERE intents = '${intent}' ORDER BY RAND() LIMIT 1`;
        const [rows, fields] = await connection.execute(sql)

        console.log(rows[0]?.respuesta ?? null)
        return rows[0]?.respuesta ?? null

    } catch (err) {
        console.error(`Error al ejecutar la consulta: ${err}`);
    }
}

module.exports = getResponseForUser;