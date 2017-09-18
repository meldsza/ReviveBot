/**
 * Modules are indiviual components that run regardless of the commands issued.
 * Require them here to be included in the bot
 */
if (!require('./../settings.json').test) {
    require('./modules/saveAccessLog')
    require('./modules/hotline.js')
    require('./modules/api.js')
    //require('./modules/influx.js')
    const modules = [
        'ingame.js',
        'influx.js'
    ]
    const pm2 = require('pm2');
    let list = [];
    pm2.list((err, l) => { list = l; fork() })
    const fork = () => {
        modules.map(n => {
            const ch = list.find(l => l.name.toLowerCase().includes(n.toLowerCase()));
            if (!ch)
                pm2.start(__dirname + '/bot/modules/' + n, {
                    name: n,
                    maxRestarts: 1,
                    minUptime: 1600,
                    watch: true,
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
}