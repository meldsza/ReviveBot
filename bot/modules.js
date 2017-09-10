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
const pm2 = require('pm2');
let list = {}
pm2.list((err, list) => { list = list; fork() })
const fork = () => {
    modules.map(n => {
        const ch = list.find(l => l.name.toLowerCase().includes(n.toLowerCase()));
        if (ch)
            return pm2.restart(ch.name, (err) => {
                if (!err)
                    console.log("Restarted " + n)
                else
                    console.log(n + ": " + err)
            })
        else
            pm2.start(cwd + '/bot/modules' + n, {
                name: n,
                maxRestarts: 1,
                minUptime: 1600,
                env: {
                    'DISCORD_TOKEN': process.env.DISCORD_TOKEN,
                    'REVIVE_API': process.env.REVIVE_API,
                    'INFLUX_HOST': process.env.INFLUX_HOST
                }
            }, (err) => {
                if (!err)
                    console.log("Started " + n)
                else
                    console.log(n + ": " + err)
            })
    })
}