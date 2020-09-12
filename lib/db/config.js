const { Pool } = require('pg');

const dbAuth = require('../../private/auth.json').db;

const LOGGING = true;

let pool = new Pool(dbAuth);

module.exports.pquery = async function(text, params) {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if(LOGGING) { console.log('executed query', {text, duration, rows: result.rowCount}); }
    return result.rows;
}