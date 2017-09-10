/**
 * Modules are indiviual components that run regardless of the commands issued.
 * Require them here to be included in the bot
 */

const modules = [
    'hotline',
    'api',
    'ingame',
    'saveAccessLog',
    'influx'
]
const fork = require('child_process').fork;

let forks = modules.map(m => fork("./bot/modules/" + m, [], { stdio: 'inherit', env: process.env }));
forks.map((p) => {
    p.on('error', console.log);
})