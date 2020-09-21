const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

module.exports.shiftToTimezone = function(d, offsetSeconds) {
    d.setUTCSeconds(d.getUTCSeconds() + offsetSeconds);
    return d;
}

module.exports.dateToTimeOfDay = function(d) {
    let hour = d.getUTCHours()%12!==0 ? d.getUTCHours() : d.getUTCHours()+12;
    let minute = d.getUTCMinutes()<10 ? '0'+d.getUTCMinutes() : d.getUTCMinutes();
    return hour>12 ? hour-12 + ':' + minute + ' p.m.' : hour + ':' + minute + ' a.m.'
}

module.exports.DAYS = DAYS;