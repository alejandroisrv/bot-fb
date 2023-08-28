const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const client = require('./wit');
const getResponseByIntents = require('./response');
const logger = require('./logger');
const getProducts = require('./products');
const getUserIntents = require('./wit');


const app = express().use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || "EAADkyZBtVhZBABOZBfCfdDxlZAUSjwvP94ZC930efLJuZB1nNHso3lxrdYycyg500pZCZAYGt1efArZCa9ktT14eMrBThreUtjgg4peFMZBQi70wADQmtF7MyKXKhS13HZCxC1rEo7hq93VhNowmWjU3b2RFAzjMN3ZBK25ZCmL07uQ1AfyZBnRgcs6mPCm20bik0ePijzFshZCG2ezt6KV8IhM"


// Buscar la regla correspondiente a la intención y entidades reconocidas por Wit.ai
const getResponseForUser = async (intent, entities) => {
    let responseText = await getResponseByIntents(intent);

    if (intent == 'Consulta_listado_productos') {

    }

    if (intent == 'Consulta_caracteristicas') {

    }

    if (intent == 'Consulta_de_precios') {
        const products = await getProducts({ modelo: entities["bot_producto:bot_producto"][0]['body'] });

        if (products.length > 0) {
            let formattedPrice = parseFloat(products[0].precio_venta).toFixed(0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            responseText = responseText.replace('Y', formattedPrice)

            console.log(responseText);
        } else {
            responseText = null
        }
    }


    return responseText;
}


const handlePostWebHook = async (req, res) => {
    logger.info('Se ha recibido una solicitud en /webhook');

    const body = req.body;

    for (const entry of body.entry) {
        const webhookEvent = entry.messaging[0];

        // Verificar si el evento es un mensaje de texto
        if (webhookEvent.message && webhookEvent.message.text) {
            const messageText = webhookEvent.message.text;
            const senderId = webhookEvent.sender.id;

            logger.info(`Mensaje de texto recibido del usuario ${senderId}: ${messageText}`);

            try {
                const { intent, entities } = await getUserIntents(messageText);
                let responseTextForUser = await getResponseForUser(intent, entities);

                if (responseTextForUser == null) {
                    responseTextForUser = 'Sin respuesta';
                }

                const response = { text: responseTextForUser };
                await sendMessengerResponseAsync(senderId, response);
                logger.info(`Respuesta enviada al usuario ${senderId}: ${responseTextForUser}`);
            } catch (error) {
                logger.error(`Error al procesar el mensaje del usuario ${senderId}: ${error}`);
                return res.status(422).json(error);
            }
        }
    }
    return res.status(200).send('EVENT_RECEIVED');
};



const sendMessengerResponseAsync = async (senderPsid, response) => {
    const requestBody = {
        recipient: { id: senderPsid },
        messaging_type: "RESPONSE",
        message: response,
    };

    logger.info(`PAGE_ACCESS_TOKEN USADO ${PAGE_ACCESS_TOKEN}`)

    try {
        const res = await axios.post(`https://graph.facebook.com/v17.0/102356822506889/messages?access_token=${PAGE_ACCESS_TOKEN}`, requestBody);
        logger.info(`Respuesta de la API de Facebook Messenger: ${res.data}`);
    } catch (error) {
        logger.error(`Error al enviar la solicitud: ${JSON.stringify(error)}`);
        throw error;
    }
}


app.post('/webhook', handlePostWebHook);

app.get('/webhook', (req, res) => {
    console.log('GET: webhook');

    const VERIFY_TOKEN = 'stringUnicoParaTuAplicacion';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK VERIFICADO');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(404);
    }
});

app.listen(3000, () => {
    console.log('Servidor iniciado...');
});