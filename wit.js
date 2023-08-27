const { Wit } = require('node-wit')

const MY_TOKEN = "7EW62GZLXMBMSHUJBYQCYQGC5RVW5UQ3";

const logger = require('./logger')


const client = new Wit({
    accessToken: MY_TOKEN,
    logger: logger, // optional
});


const getUserIntents = async (messageText) => {

    const response = await client.message(messageText)

    return {
        intent: response.intents[0]?.name,
        entities: response.entities,
    }
}

module.exports = getUserIntents;
