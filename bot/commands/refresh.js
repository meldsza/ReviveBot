const refresh = require('./../lib/refresh');
const settings = require('./../../settings.json');
const request = require('request-promise-native');
/**
 * This method should return the response directly to the channel
 * @param {*string array} params 
 * @param {*message} message
 */
async function command(params, message) {
    if (params.length >= 1) {
        message.mentions.users.map(async function (u) {
            if (await refresh(u))
                await message.channel.send(u.toString() + " sucessfully linked");
            else
                await message.channel.send(u.toString() + " unable to be refresh as the person has not linked his account yet");
        });
        if (!settings.owners.includes(message.author.id)) return;
        message.mentions.roles.map(function (r) {
            console.log("Linking everyone in " + r.name);
            r.members.map(async function (m) {
                let u = m.user;
                console.log("refreshing " + u.username);
                if (await refresh(u))
                    await message.channel.send(u.toString() + " sucessfully linked");
                else
                    await message.channel.send(u.toString() + " unable to be refresh as the person has not linked his account yet");
            })
        });
    }
    else {
        if (await refresh(message.author))
            await message.channel.send(message.author.toString() + " sucessfully linked");
        else
            await message.channel.send(message.author.toString() + " unable to be refresh as you have not linked his account yet. See your DM");
    }
    return true;
}
/**
 * description of the command
 */
const description = "Refreshes your linked account status";
/**
 * Define Exports
 */
module.exports = {
    execute: command,
    description: description,
    custom: true
};
