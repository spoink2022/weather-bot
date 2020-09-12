const { fetchServer } = require('../db/server.js');

let servers = {};

module.exports.fetchPrefix = async function(serverid) {
    if(servers[serverid]) { return servers[serverid].prefix; }
    await cacheServer(serverid);
    //console.log(servers[serverid]);
    return servers[serverid].prefix;
}

async function cacheServer(serverid) {
    servers[serverid] = await fetchServer(serverid);
    return;
}