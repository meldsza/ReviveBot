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
console.log("forking processes");
let forks = modules.map(m => fork("./bot/modules/" + m, [], { stdio: 'inherit', env: process.env }));
forks.map((p) => {
    console.log('Fork pid: ' + p.pid)
    p.on('error', console.log);
    p.on('close', console.log);
    p.on('exit', console.log);
})