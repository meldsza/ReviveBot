const Discord = require('discord.js');
const bot = new Discord.bot();

var dt = process.env.DISCORD_TOKEN || process.argv[2];

if (!dt) {
    console.log('required DISCORD_TOKEN env variable or argument');
}

bot.login(dt);

bot.on('error', e => {
    console.error(e);
});

module.exports = bot;
const spawn = require('child_process').spawn;
var pm2 = false;

/*
    These functions are bootstrapping the bot process
    so we can manage it with a parent process
    cool, i guess...
*/

function startlog() {

    if (pm2 !== false) {
        console.log('pm2 logs process already started...');
        return;
    }
    start = false;

    pm2 = spawn('pm2', ['logs']);
    pm2.on('exit', (code, signal) => {
        console.log('PM2 EXIT');
    })

    pm2.stderr.on('data', (data) => {
        // console.error(data.toString());
        bot.channels.get("275077677852000257").sendCode("shell", 'ERROR- ' + data, { split: true });
    });

    pm2.stdout.on('data', (data) => {
        //console.log(data.toString());
        bot.channels.get("275077677852000257").sendCode("shell", 'Log - ' + data, { split: true });
    });

    return pm2;
};


bot.on('ready', () => {
    startlog();
    console.log("logs ready");
    bot.channels.get("275077677852000257").sendMessage('Bot Ready (pid: ' + process.pid + ')');
})

bot.on('message', message => {
    if (message.author.bot) return;
    var guild = bot.guilds.get('256299642180861953');

    if (message.guild != guild) {
        return;
    }
    if (!message.member.roles.find('name', 'dev')) return;
    var msg = message.content.toLowerCase();

    if (msg == '~restart') {
        bot.channels.get("275077677852000257").sendMessage('Exiting with code 0');
        process.exit();
    }
    else if (msg == '~status') {
        message.reply(':) (pid: ' + process.pid + ')');
    } else if (msg.startsWith('~cmd')) {
        const exec = require('child_process').exec;
        exec(msg.substring(5), (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                message.channel.sendCode("shell", '**ERROR** Shell-' + error + '\n' + stderr, { split: true });
                return;
            }
            console.log(`stdout: ${stdout}`);
            message.channel.sendCode("shell", stdout + { split: true });
            console.log(`stderr: ${stderr}`);
        });
    }
});