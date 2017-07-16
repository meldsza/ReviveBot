const bot = require('./../bot');
const request = require('request-promise-native')
/**
 * This method should return the response directly to the channel
 * @param {*string array} params 
 * @param {*message} message
 */
async function command(params, message) {
    const guild = bot.guilds.get("184536578654339072");
    let member = guild.member(message.author.id);
    if (!member)
        return message.reply("This command is only for Revive Network users");
    if (!member.roles.get("335972667322662923"))
        return message.reply("you are not a beta member");
    let key = await request({
        method: "POST",
        uri: "http://localhost/v0/discord/beta/" + message.author.id
    });
    key = JSON.parse(key);
    if (key.error) {
        return message.reply("You should link your account first");
    }
    else if (key.key) {
        message.author.send("Your new Revive Heroes Alpha token is ```xl\n" + key.key+"\n```")
            .then(()=>message.channel.send("Key has been DMed to you")).catch(()=> message.reply("You have disabled DMs"));
        
    }
    else
        return message.reply("There was some problem generating a key");
}
/**
 * description of the command
 */
const description = "gives a beta key";
/**
 * Define Exports
 */
module.exports = {
    execute: command,
    description: description
};