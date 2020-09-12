module.exports.run = function(cmd, msg, args) {
    if(cmd === 'ping') {
        ping(msg);
    }
}

function ping(msg) {
    msg.channel.send('pong!');
}