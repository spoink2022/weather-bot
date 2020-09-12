module.exports.parseCmdFromMessage = function(msgContent) {
    return msgContent.split(' ')[0].toLowerCase();
}

module.exports.parseArgsFromMessage = function(msgContent) {
    return msgContent.substring(module.exports.parseCmdFromMessage(msgContent).length + 1).toLowerCase().split(' ');
}