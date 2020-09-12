const { MessageEmbed } = require('discord.js');

const color = require('../static/color.json');

module.exports.createEmbed = async function(options) {
    let o = options, embed = new MessageEmbed();
    if(o.author) { o.author.length>1 ? embed.setAuthor(o.author[0], o.author[1]) : embed.setAuthor(o.author[0]) }
    if(o.title) { embed.setTitle(o.title); }
    if(o.color) { embed.setColor(color[o.color]); }
    if(o.description) { embed.setDescription(o.description); }
    if(o.fields) { embed.addFields(o.fields); }
    if(o.footer) { embed.setFooter(o.footer); }
    return embed;
}