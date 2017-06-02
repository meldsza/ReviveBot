const request = require('request-promise-native');
const bot = require('./../bot');
const md = require('html-md');
const RichEmbed = require('discord.js').RichEmbed;
const did_from_uname = async function (uname) {
    let res = await request('http://localhost/v0/discord/did_from_uname/' + encodeURIComponent(uname))
    return res.id;
}
module.exports = {
    'ping': function (body) {
        console.log("Recieved a ping event\n" + body);
    },
    'post': async function (body) {
        console.log("Recieved a post event for post no: " + body.post.post_number);
        let embed = new RichEmbed();
        embed.setAuthor(body.post.username, body.post.avatar_template.replace('{size}', "100")).setDescription(md(body.post.cooked))
        if (body.post.reply_to_user && body.post.reply_to_user.username) {
            bot.users.get(await did_from_uname(body.post.reply_to_user.username)).send('You recieved a reply from ' + body.post.username + ' for post ' + body.base_url + '/t/' + body.post.topic_slug + '/' + body.post.topic_id + '/' + body.post.post_number)
        }
    },
    'user': async function (body) {
        console.log("Recieved user event");
    }
}