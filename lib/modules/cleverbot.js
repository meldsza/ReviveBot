const bot = require('../utils/bot');
var cleverbot = require("cleverbot.io")
console.log(process.env.CB_API_TOKEN);
cleverbot = new cleverbot("EkMP8RKuszTTlIc9", process.env.CB_API_TOKEN);



cleverbot.setNick('ReviveBot');
cleverbot.create(function (err, session) {
    bot.on('message', message => {
        if (!message.isMentioned(bot.user)) return;
        msg = message.cleanContent.replace('@ReviveBot', "");
        console.log(msg);
        cleverbot.ask(msg, function (err, response) {

            if (err)
                message.channel.sendMessage("ERROR: " + err);
            message.channel.sendMessage(response);
        });
    });
});