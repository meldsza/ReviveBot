const bookshelf = require('./../bookshelf');
const bot = require('./../bot/bot');
var Message = bookshelf.Model.extend({
    tableName: 'discord_messages',
    hasTimestamps: false,
    message: function () {
        return bot.guilds.get(this.attributes.channel).messages.fetch(this.attributes.messageID)
    },
    user: function () {
        return this.message().author;
    }
});
module.exports = Message;
