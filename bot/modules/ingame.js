const settings = require('./../../settings.json');
if (!settings.clientOptions)
  settings.clientOptions = {};
settings.messageCacheMaxSize = 1;
settings.messageCacheLifetime = 1;
settings.messageSweepInterval = 5;
if (!settings.clientOptions.disabledEvents)
  settings.clientOptions.disabledEvents = ["TYPING_START", "VOICE_SERVER_UPDATE", "VOICE_STATE_UPDATE"];
const disabledEvents = ["CHANNEL_CREATE", "CHANNEL_PINS_UPDATE", "GUILD_BAN_REMOVE", "PRESENCE_UPDATE", "CHANNEL_DELETE", "CHANNEL_UPDATE", "MESSAGE_CREATE", "MESSAGE_DELETE", "MESSAGE_UPDATE", "MESSAGE_DELETE_BULK", "MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE", "MESSAGE_REACTION_REMOVE_ALL", "GUILD_BAN_REMOVE", "GUILD_BAN_ADD", "GUILD_ROLE_DELETE", "GUILD_ROLE_CREATE"]
disabledEvents.map(e => settings.clientOptions.disabledEvents.push(e))
const bot = require('./../bot');
const influx = require('./../../influx');
const request = require('request-promise-native');
let ingame;


let guild;
const updateIngame = async function () {
  if (!guild && !ingame) return;

  let playing = await request('http://' + (settings.revive_api || 'localhost') + '/v0/discord/online');
  playing = JSON.parse(playing);

  let toRemove = ingame.members.filter(function (m) {
    if (!playing.includes(m.user.id)) {
      //console.log("Not playing : "+ m.user.id)
      return m;
    }
  });
  await Promise.all(toRemove.map(async function (m) {
    await m.removeRole(ingame);
  }));
  await Promise.all(playing.map(async function (m) {
    if (m === "") return;
    const user = await bot.fetchUser(m);
    if (!user) return;
    try {
      const member = await guild.fetchMember(user);
      if (!member.roles.get(ingame.id))
        await member.addRole(ingame);
    }
    catch (e) {
    }
  }));
  influx.writePoints([
    {
      measurement: 'statistics',
      fields: { count: playing.length },
      tags: { type: 'ingame' }
    }
  ]).catch(console.log);
};
bot.on('ready', () => {
  guild = bot.guilds.get("184536578654339072");
  ingame = guild.roles.get("322233107489226764");
});
setInterval(updateIngame, 5000)
