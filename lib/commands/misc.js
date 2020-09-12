const db = require('../db');
const { createEmbed } = require('../misc/create.js');

module.exports.run = function(cmd, msg, args) {
    if(cmd === 'BOT PING') {
        sendResponseToPing(msg);
    } else if(cmd === 'ping') {
        sendPing(msg);
    }
}

async function sendResponseToPing(msg) { // runs when bot is pinged
    let user = await db.user.fetchUser(msg.author.id);
    let server = msg.channel.type==='dm' ? null : await db.server.fetchServer(msg.channel.guild.id);

    let fields = [
        { name: 'User', value: `Prefix :speech_balloon:: \`${user.prefix}\``, inline: true}
    ]
    if(server) {
        fields.push({ name: 'Server', value: `stuff plz`, inline: true });
    }

    let options = {
        'author': [msg.author.tag, msg.author.displayAvatarURL()],
        'title': 'Overview',
        'color': 'grey',
        'description': `For detailed instruction, type \`${user.prefix}help\``,
        'fields': fields
    }
    let embed = await createEmbed(options);
    msg.reply('', embed);
}

function sendPing(msg) {
    msg.channel.send('pong!');
}