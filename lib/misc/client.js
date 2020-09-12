// creates the discord client
// required by bot.js
const { Client } = require('discord.js');

const auth = require('../../private/auth.json');
const config = require('../../config.json');

const commands = require('../commands');
const { parseCmdFromMessage, parseArgsFromMessage } = require('./parse.js');
const commandList = require('../static/commandList.json');
const { fetchPrefix } = require('../tracker/prefix.js');

let client = new Client();

client.login(auth.discordToken);

client.on('ready', onReady);
client.on('message', onMessage);
client.on('guildMemberAdd', onGuildMemberAdd);

function onReady() {
    client.user.setActivity('ping me for help', {type: 'PLAYING'});
    console.log(`v${config.botVersion}\nLogged in as ${client.user.tag}!`);
}

async function onMessage(msg) {
    if(!msg.author.bot) {
        let prefix = await fetchPrefix(msg.author.id);
        if(msg.content.startsWith(prefix)) {
            let msgContent = msg.content.substring(prefix.length);
            let cmd = parseCmdFromMessage(msgContent);
            let args = parseArgsFromMessage(msgContent);
            for(let [cmdFile, cmdEntries] of Object.entries(commandList)) {
                for(let [cmdName, cmdAliasList] of Object.entries(cmdEntries)) {
                    if(cmd === cmdName || cmdAliasList.includes(cmd)) {
                        commands[cmdFile].run(cmdName, msg, args);
                        return;
                    }
                }
            }
        } else if(msg.mentions.users.first() && msg.mentions.users.first().id === client.user.id) {
            commands.misc.run('BOT PING', msg, null);
        }
    }
}

function onGuildMemberAdd() {

}

module.exports = client;