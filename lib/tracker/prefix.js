const { fetchPrefix } = require('../db/user.js');

let prefixMap = {};

module.exports.fetchPrefix = async function(userid) {
    if(!prefixMap[userid]) { prefixMap[userid] = await fetchPrefix(userid); }
    return prefixMap[userid];
}