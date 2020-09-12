parseCmdFromMessage = function(msgContent) {
    return msgContent.split(' ')[0].toLowerCase();
}
module.exports.parseCmdFromMessage = parseCmdFromMessage;

module.exports.parseArgsFromMessage = function(msgContent) {
    return msgContent.substring(parseCmdFromMessage(msgContent).length + 1).toLowerCase().split(' ');
}