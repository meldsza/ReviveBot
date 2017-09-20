const Discord = require('discord.js');
const settings = require('./../settings.json');
if (!settings.clientOptions)
    settings.clientOptions = {};

if (!settings.clientOptions.disabledEvents)
    settings.clientOptions.disabledEvents = ["TYPING_START", "VOICE_SERVER_UPDATE", "VOICE_STATE_UPDATE"];
settings.clientOptions.disableEveryone = true;
const client = new Discord.Client(settings.clientOptions);
var dt = settings.token || process.env.DISCORD_TOKEN || process.argv[2];

if (!dt) {
    console.log('required DISCORD_TOKEN env variable or argument');
}

client.login(dt);

client.on('error', e => {
    console.error(e);
});

module.exports = client;
