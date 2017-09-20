/**
 * Modules are indiviual components that run regardless of the commands issued.
 * Require them here to be included in the bot
 */
if (!require('./../settings.json').test) {
    require('./modules/saveAccessLog')
    require('./modules/hotline.js')
    require('./modules/api.js')
}