const settings = require('./../../settings.json');
if (!settings.clientOptions)
    settings.clientOptions = {};
settings.messageCacheMaxSize = 1;
settings.messageCacheLifetime = 1;
settings.messageSweepInterval = 5;
if (!settings.clientOptions.disabledEvents)
    settings.clientOptions.disabledEvents = ["TYPING_START", "VOICE_SERVER_UPDATE", "VOICE_STATE_UPDATE"];
const disabledEvents = ["CHANNEL_CREATE", "CHANNEL_PINS_UPDATE", "GUILD_BAN_REMOVE", "CHANNEL_DELETE", "CHANNEL_UPDATE", "MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE", "MESSAGE_REACTION_REMOVE_ALL", "GUILD_BAN_REMOVE", "GUILD_BAN_ADD"]
disabledEvents.map(e => settings.clientOptions.disabledEvents.push(e))
const bot = require('./../bot.js');
const influx = require('./../../influx');
const Message = require('./../../orm/Message');
let ready = false;
let count = 0;
console.log("Influx module active");
bot.on('ready', async function () {
    let dbs = await influx.getDatabaseNames();
    console.log(dbs);
    if (!dbs || dbs === null)
        console.log("Cant connect to influx")
    if (!dbs.includes('discord')) {
        console.log("Creating Dicord DB");
    }
    count = await Message.count();
    ready = true;
});
bot.on('message', () => count++)
bot.on('messageDelete', () => count++)
setInterval(async function () {
    if (!ready) return;
    const guild = bot.guilds.get("184536578654339072");
    influx.writePoints([
        {
            measurement: 'statistics',
            fields: { count: guild.memberCount },
            tags: { type: 'members' }
        }
    ]).catch(console.log);
    if (count)
        influx.writePoints([
            {
                measurement: 'statistics',
                fields: { count: count },
                tags: { type: 'messages' }
            }
        ]).catch(console.log);
    guild.roles.map(r => {
        influx.writePoints([
            {
                measurement: 'statistics',
                fields: { count: r.members.size },
                tags: { type: r.id }
            }
        ]).catch(console.log);
    });
    influx.writePoints([
        {
            measurement: 'statistics',
            fields: { count: guild.presences.filter(p => p.status != 'offline').size },
            tags: { type: "online" }
        }
    ]).catch(console.log);
}, 1000)
