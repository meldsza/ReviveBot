require('./settings.json').test = true;
require('./index');
const bot = require('./bot/bot');
bot.on('ready', () => process.exit());
