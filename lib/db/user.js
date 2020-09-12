const config = require('../../config.json');

const { pquery } = require('./config.js');

// ---------- fetch user + modifications ----------
module.exports.fetchUser = async function(userid) {
    let query = `SELECT * FROM users WHERE userid=$1`;
    let user = (await pquery(query, [userid]))[0];
    if(!user) {
        query = 'INSERT INTO users (userid, prefix) VALUES ($1, $2) RETURNING *';
        user = (await pquery(query, [userid, config.defaultPrefix]))[0];
    }
    return user;
}

module.exports.fetchPrefix = async function(userid) {
    let user = await module.exports.fetchUser(userid);
    return user.prefix;
}
// __________