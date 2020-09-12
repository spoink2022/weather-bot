const { pquery } = require('./config.js');

module.exports.fetchServer = async function(serverid) {
    let query = `SELECT * FROM servers WHERE serverid=$1`;
    let server = (await pquery(query, [serverid]))[0];
    if(!server) {
        query = 'INSERT INTO servers (serverid) VALUES ($1) RETURNING *';
        server = (await pquery(query, [serverid]))[0];
    }
    return server;
}