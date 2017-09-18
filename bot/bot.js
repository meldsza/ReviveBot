const Discord = require('discord.js');
const settings = require('./../settings.json');
const client = new Discord.Client({ disableEveryone: true });
global.revive_api = settings.revive_api || process.env.REVIVE_API;
global.influx_host = settings.influx_host || process.env.INFLUX_HOST;
var dt = settings.token || process.env.DISCORD_TOKEN || process.argv[2];

if (!dt) {
    console.log('required DISCORD_TOKEN env variable or argument');
}

client.login(dt);

client.on('error', e => {
    console.error(e);
});

module.exports = client;
