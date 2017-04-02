const bf2142 = require('revive-stats.js').bf2142;
const p2str = require('./../lib/p2str');
const bot = require('./../bot');
/**
 * This method should return the response directly to the channel
 * @param {*string array} params 
 * @param {*message} message
 */
async function command(params, message) {
    let nick = params[0];
    bf2142.getPlayers(nick).then(plist => {
        if (plist.length == 0) {
            message.channel.sendMessage("Player not found");
            return;
        }
        p2str(plist[0], "bf2142").then(pl => message.channel.sendMessage(pl).then(msg => {
            if (plist.length === 1) return;
            msg.react('▶').then(
                msg.react('◀')).then(
                msg.react('⏩')).then(
                msg.react('⏪'))
            bot.emit('addNav', { message: msg, exec: (p) => p2str(p, "bf2142"), arr: plist, index: 0 });
        }));
    }).catch(message.channel.sendMessage);
}
/**
 * description of the command
 */
const description = "shows bf2142 stats of the username provided";
/**
 * Define Exports
 */
module.exports = {
    execute: command,
    description: description
};
