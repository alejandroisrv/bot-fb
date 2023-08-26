const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const winston = require('winston');
const { Wit } = require('node-wit')



const app = express().use(bodyParser.json());

const PAGE_ACCESS_TOKEN = "EAADkyZBtVhZBABOyC09iMWsgl6k9aZBBMod2rZCc9Kgw13mJ13YQJyj73uaYdFoJUG59PzYaipXfux3ufFPTGaVN09M3q56ypIy5pAva1VDolgSZAFaPSi4c9M9T45jd4iMAiK6fIhP4f6RiWCwpuYbZC0WXvTaLZA7AJsoqWo1YluJFhwkZA2Ie2wVavlSthb8t2ccV1L8GNZB4zeP7m"

const MY_TOKEN = "7EW62GZLXMBMSHUJBYQCYQGC5RVW5UQ3";

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'my-app' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});


const client = new Wit({
    accessToken: MY_TOKEN,
    logger: logger, // optional
});


const rules = [
    {
        intent: 'Consulta_de_precios',
        response: [
            'El precio del producto es $50',
            'El precio del producto es $100',
            'El precio del producto es $150'
        ]
    },
    {
        intent: 'Consulta_disponibilidad',
        response: [
            'El producto está disponible',
            'El producto no está disponible en este momento',
            'El producto estará disponible en una semana'
        ]
    },
    {
        intent: 'Consulta_informacion_producto',
        response: [
            'El producto es de alta calidad y está hecho con materiales duraderos',
            'El producto tiene una garantía de un año',
            'El producto es compatible con la mayoría de los dispositivos'
        ]
    },
    {
        intent: 'Saludo',
        response: [
            '¡Hola! ¿En qué puedo ayudarte hoy?',
            '¡Bienvenido! ¿En qué puedo ayudarte hoy?',
            '¡Hola! ¿Cómo estás?'
        ]
    },
    {
        intent: 'consulta_garantia',
        response: [
            'El producto tiene una garantía de un año',
            'La garantía del producto es de seis meses',
            'La garantía del producto es de dos años'
        ]
    },
    {
        intent: 'consulta_informacion_entrega',
        response: [
            'El producto será entregado en dos días hábiles',
            'El producto será entregado en una semana',
            'El producto será entregado en dos semanas'
        ]
    },
    {
        intent: 'consulta_informacion_tienda',
        response: [
            'Nuestra tienda está ubicada en el centro de la ciudad',
            'Nuestra tienda está abierta de lunes a sábado de 9am a 6pm',
            'Nuestra tienda tiene una amplia selección de productos'
        ]
    },
    {
        intent: 'consulta_listado_productos',
        response: [
            'Tenemos una amplia selección de productos, ¿en qué estás interesado?',
            'Puedes encontrar nuestro listado de productos en nuestro sitio web',
            '¿Estás buscando un producto en particular?'
        ]
    }
];

// Buscar la regla correspondiente a la intención y entidades reconocidas por Wit.ai
function findRule(intent, entities) {
    for (const rule of rules) {
        if (rule.intent === intent) {
            if (!rule.entities || rule.entities.every(entity => entities.hasOwnProperty(entity))) {
                return rule;
            }
        }
    }
    return null;
}

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

                client.message(messageText).then((response) => {
                    console.log(`Respuesta generada por Wit.ai: ${JSON.stringify(response)}`);
                })

                // Obtener el ID del remitente
                const senderPsid = webhookEvent.sender.id;

                client.message(messageText).then((response) => {
                    console.log(`Respuesta generada por Wit.ai: ${JSON.stringify(response)}`);

                    // Generar una respuesta basada en la respuesta de Wit.ai
                    const intent = response.intents[0]?.name;
                    const entities = response.entities;
                    const rule = findRule(intent, entities);
                    if (rule !== null) {
                        const responseArray = rule.response;
                        const randomIndex = Math.floor(Math.random() * responseArray.length);
                        const responseText = responseArray[randomIndex];
                        const response = { text: responseText };
                        sendMessengerResponse(senderPsid, response, (err, body) => {
                            if (err) {
                                console.error(`Error al enviar la respuesta: ${err}`);
                                res.status(422).json(err);
                            } else {
                                console.log(`Respuesta enviada: ${body}`);
                                res.status(200).json(body);
                            }
                        });
                    } else {
                        const responseText = 'Lo siento, no entiendo lo que quieres decir';
                        const response = { text: responseText };
                        sendMessengerResponse(senderPsid, response, (err, body) => {
                            if (err) {
                                console.error(`Error al enviar la respuesta: ${err}`);
                                res.status(422).json(err);
                            } else {
                                console.log(`Respuesta enviada: ${body}`);
                                res.status(200).json(body);
                            }
                        });
                    }
                }).catch((err) => {
                    console.error(`Error al generar la respuesta con Wit.ai: ${err}`);
                    res.status(500).json(err);
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