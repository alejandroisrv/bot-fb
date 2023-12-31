const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const client = require('./wit');
const getResponseForUser = require('./response');
const logger = require('./logger');
const getProducts = require('./products');
const getUserIntents = require('./wit');


const app = express().use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || "EAADkyZBtVhZBABO2bUPVWxHCZBAXpVz176vP3RdBqIVvFPjtBvOEIyZBi8ZBqkPf7ykJU4SyZCTOZCAiYwJZCvGpjsVTEUObTnCdsT0EDMeG5l6XP7cU7ZBYTVeRHoGOEw2FCbFG2y7JAlhAqsx6IESVjT71vO83zYqcJSSgfrcW2eWHjtJMWqCZAErM85MIqrUu6qjccmZAsVmYD3lwKKS"

const handlePostWebHook = async (req, res) => {
    const page = req.params.page
    
    logger.info('Se ha recibido una solicitud en /webhook/'+ page);

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
                logger.info(`Intencion del usuario ${intent}`);
                let responseTextForUser = await getResponseForUser(intent, entities);

                if (responseTextForUser == null) {
                    responseTextForUser = 'Sin respuesta';
                }

                const response = { text: responseTextForUser };
                await sendMessengerResponseAsync(senderId, response, page);
                logger.info(`Respuesta enviada al usuario ${senderId}: ${responseTextForUser}`);
            } catch (error) {
                logger.error(`Error al procesar el mensaje del usuario ${senderId}: ${error}`);
                return res.status(422).json(error);
            }
        }
    }
    return res.status(200).send('EVENT_RECEIVED');
};



const sendMessengerResponseAsync = async (senderPsid, response, page) => {
    const requestBody = {
        recipient: { id: senderPsid },
        messaging_type: "RESPONSE",
        message: response,
    };

    const ids = {
        tecnowins: "102356822506889",
        alejandro: ""
    }

    logger.info(`PAGE_ACCESS_TOKEN USADO ${PAGE_ACCESS_TOKEN}`)

    try {
        const res = await axios.post(`https://graph.facebook.com/v17.0/${ids[page]}/messages?access_token=${PAGE_ACCESS_TOKEN}`, requestBody);
        logger.info(`Respuesta de la API de Facebook Messenger: ${res.data}`);
    } catch (error) {
        logger.error(`Error al enviar la solicitud: ${JSON.stringify(error)}`);
        throw error;
    }
}


app.post('/webhook/:page', handlePostWebHook);

app.get('/webhook/:page', (req, res) => {
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