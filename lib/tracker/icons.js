const { loadImage } = require('canvas');

const ICON_LIST = ['01', '02', '03', '04', '09', '10', '11', '13', '50'];
const URL = 'http://openweathermap.org/img/wn/';
const DELIM = '@4x.png';
let ICON_MAP = {};

loadIcons();

async function loadIcons() {
    let startTime = Date.now();
    for(let num of ICON_LIST) {
        ICON_MAP[num+'d'] = await loadImage(URL + num + 'd' + DELIM);
        ICON_MAP[num+'n'] = await loadImage(URL + num + 'n' + DELIM);
    }
    console.log(`Loaded icons in ${Date.now()-startTime}ms`);
}

module.exports.fetchIcon = function(key) {
    return ICON_MAP[key];
}