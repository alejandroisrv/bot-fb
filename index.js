const express = require('express');
const bodyParser = require('body-parser');
const request = require('request')

const app = express().use(bodyParser.json());

const PAGE_ACCESS_TOKEN = "EAADkyZBtVhZBABO5jyFTxtj4fyRnnXoZAhqCON8GNm8zBiBpGLg6cgkrboYcY3RFnTlbaZCsiJwWnZA3RLtZB94k4oS5o8S1XsfQ5BZCI8bIgNxJqyO1fMxMrhqMgbj6693NZCCuzgHuAVAQ91qR8ZBKN6qkIQxGakSgmOpR1o5BIv81SzrCAAi6sMKATg15ZB2MZAmJj2ZAHWMBEIB5asxm"

function sendMessengerResponse(senderPsid, response) {
    // Construir el cuerpo de la solicitud
    const requestBody = {
        recipient: {
            id: senderPsid
        },
        message: response
    };

    // Enviar la solicitud a la API de Messenger
    request({
        uri: 'https://graph.facebook.com/v17.0/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: requestBody
    }, (err, res, body) => {
        if (!err && res.statusCode === 200) {
            console.log('Mensaje enviado a Facebook Messenger');
        } else {
            console.error('No se pudo enviar el mensaje a Facebook Messenger');
            console.error(res);
            console.error(body);
        }
    });
}

app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(entry => {
            // se reciben y procesan los mensajes
            const webhookEvent = entry.messaging[0];
            // Verificar si el evento es un mensaje de texto
            if (webhookEvent.message && webhookEvent.message.text) {
                const messageText = webhookEvent.message.text;
                // Construir la respuesta
                const response = {
                    text: `Gracias por tu mensaje: "${messageText}"`
                };

                // Enviar la respuesta a Facebook Messenger
                sendMessengerResponse(webhookEvent.sender.id, response);
            }
        });

        res.status(200).send('EVENTO RECIBIDO');
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