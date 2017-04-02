const request = require('request-promise-native');
const Discord = require('discord.js');
const revive = require('revive-stats.js')
const moment = require('moment');

/**
 * This method should return the response directly to the channel
 * @param {*string array} params 
 * @param {*message} message
 */
async function command(params, message) {
    if (message.mentions.users.size === 0 && params.length > 0) {
        message.reply("Usage:\n~info - shows your stats" +
            "\n~info <usermention> - shows stats of the user mentioned\n"
            + "(the user should have linked his forum account with his discord account)");
        return;
    }
    var id = message.mentions.users.first() || message.author;
    id = id.id;
    let all = false;
    if (id === message.author.id) all = true;
    let arr = [];
    request("http://revive-bot-discord.revive.systems/v0/discord/userinfo/" + id).catch(err => { console.log(err); message.channel.sendMessage('api down') }).then(body => {
        try { body = JSON.parse(body) } catch (e) { console.log("error: " + body); }
        console.log(body);
        if (body.error) {
            if (all)
                return message.reply("Please link your discord account first using `~link`");
            return message.reply("The requested user hasnt linked his discord account with thier revive account");
        }
        for (let i = 0; i < body.soldiers.length; i++) {
            let soldier = body.soldiers[i];
            if (!all) {
                if (soldier.nickname != body.username)
                    continue;
            }
            let gameob = soldier.game == "stella" ? revive.bf2142 : revive.bf2;
            let g = soldier.game == "stella" ? 'bf2142' : 'bf2';
            let ranklink = soldier.game == 'stella' ? 'https://github.com/ReviveNetwork/ReviveBot/raw/master/img/bf2142/rank_' : 'https://battlelog.co/img/ranks/rank_'
            gameob.getPlayer(soldier.pid).then(rank => {
                if (!rank) { throw new Error("Player" + soldier.nickname + " Doesnt have any stats") }
                let embed = new Discord.RichEmbed()
                    .setTitle(soldier.nickname)
                    .setThumbnail(ranklink + rank.rank + '.png')
                    .addField("Game: ", (soldier.game == "stella" ? "Battlefield 2142" : "Battlefield 2"), true)
                    .addField("Rank: ", (soldier.game == "stella" ? require('../../data/bf2142rank.json') : require('../../data/bf2rank.json'))[rank.rank], true)
                    .addField("Online: ", (soldier.online == 1 ? "yes" : "no"), true)
                    .addField("Last Active: ", moment(soldier.last_active, "YYYY-MM-DD HH:mm:ss").fromNow(), true)
                    .addField("KDR: ", rank.kdr, true)
                    .addField("Kills per Minute: ", rank.killsPM, true)
                    .addField("Deaths per Minute: ", rank.deathsPM, true)
                    .addField("Kill Streak: ", rank.bestKillStreak, true)
                    .addField("Death Streak: ", rank.worstDeathStreak, true)
                    .addField("Favourite Kit: ", revive.constants[g].kits[rank.favKit], true)
                    .addField("Favourite Vehicle: ", revive.constants[g].vehicles[rank.favVehicle], true)
                    .addField("Heals: ", rank.heals, true)
                    .addField("Revives: ", rank.revives, true);
                ((rank.topOpponentName) ? (embed.addField("Top Opponent: ", rank.topOpponentName, true).addField("Top Victim: ", rank.topVictimName, true)) : "");
                embed.setURL((soldier.game == "stella" ? "http://bl2142.co/bfhq.php?pid=" : "http://battlelog.co/bfhq.php?pid=") + soldier.pid)
                    .setFooter("Created " + moment(soldier.time_created, "YYYY-MM-DD HH:mm:ss").fromNow())
                    .setColor(soldier.game == "stella" ? "#0000FF" : "#ff0000");
                message.channel.sendEmbed(embed).catch(message.channel.sendMessage);
            });
        }
    });
}
/**
 * description of the command
 */
const description = "Shows battlelog.co stats";
/**
 * Define Exports
 */
module.exports = {
    execute: command,
    description: description
};