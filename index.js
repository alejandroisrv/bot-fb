const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const winston = require('winston');



const app = express().use(bodyParser.json());

const PAGE_ACCESS_TOKEN = "EAADkyZBtVhZBABOyC09iMWsgl6k9aZBBMod2rZCc9Kgw13mJ13YQJyj73uaYdFoJUG59PzYaipXfux3ufFPTGaVN09M3q56ypIy5pAva1VDolgSZAFaPSi4c9M9T45jd4iMAiK6fIhP4f6RiWCwpuYbZC0WXvTaLZA7AJsoqWo1YluJFhwkZA2Ie2wVavlSthb8t2ccV1L8GNZB4zeP7m"

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'my-app' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

function sendMessengerResponse(senderPsid, response, callback) {
    // Construir el cuerpo de la solicitud
    const requestBody = {
        recipient: {
            id: senderPsid
        },
        messaging_type: "RESPONSE",
        message: response,
    };

    // Enviar la solicitud a la API de Messenger
    axios.post(`https://graph.facebook.com/v11.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, requestBody)
        .then((res) => {
            console.log(`Código de estado de la respuesta: ${res.status}`);
            callback(null, res.data);
        })
        .catch((err) => {
            console.error(`Error al enviar la solicitud: ${util.inspect(err)}`);
            callback(err);
        });
}

app.post('/webhook', (req, res) => {
    logger.info('Se ha recibido una solicitud en /webhook');
    const body = req.body;
    if (body.object === 'page') {
        body.entry.forEach((entry) => {
            const webhookEvent = entry.messaging[0];
            logger.info('Se ha recibido un evento de webhook:', webhookEvent);

            // Verificar si el evento es un mensaje de texto
            if (webhookEvent.message && webhookEvent.message.text) {
                const messageText = webhookEvent.message.text;
                logger.info(`Mensaje de texto recibido: ${messageText}`);

                // Obtener el ID del remitente
                const senderPsid = webhookEvent.sender.id;

                // Construir la respuesta
                const response = {
                    text: `Gracias por tu mensaje: "${messageText}"`
                };

                // Enviar la respuesta a Facebook Messenger
                sendMessengerResponse(senderPsid, response, (err, body) => {
                    if (err) {
                        logger.error(`Error al enviar la respuesta: ${err}`);
                        res.status(422).json(err);
                    } else {
                        logger.info(`Respuesta enviada: ${body}`);
                        res.status(200).json(body);
                    }
                });
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

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