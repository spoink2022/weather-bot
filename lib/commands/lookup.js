const { createEmbed, createCanvasWeatherForecast } = require('../misc/create.js');
const datetime = require('../misc/datetime.js');
const { geocode, getWeatherFromCoords } = require('../misc/endpoint.js');

module.exports.run = function(cmd, msg, args) {
    if(cmd === 'weather') {
        sendWeather(msg, args);
    }
}

async function sendWeather(msg, args) {
    if(args[0] === '') { // location not provided
        msg.reply('**Location Not Provided**\n`weather <location>` expects a location, but did not receive one'); return;
    }
    let placeName = args.join(' ');
    let locationData = await geocode(placeName);
    if(!locationData) { // location not found
        msg.reply(`**Location Not Found**\n\`${placeName}\` could not be attributed to a location`); return;
    }
    let options = { 'title': `Fetching weather for ${locationData.formatted_string}...`, 'color': 'sky blue'};
    let embed = await createEmbed(options);
    msg.channel.send(embed).then(async (sentMessage) => {
        let weather = (await getWeatherFromCoords(locationData.lat, locationData.lon, locationData.tz_offset));
        let canvasBuffer = await createCanvasWeatherForecast(locationData, weather);

        let sunriseDate = datetime.shiftToTimezone(new Date(weather.current.sunrise * 1000), locationData.tz_offset);
        let sunsetDate = datetime.shiftToTimezone(new Date(weather.current.sunset * 1000), locationData.tz_offset);

        let options = {
            'title': `Weather for ${locationData.formatted_string}`,
            'color': 'sky blue',
            'attachment': { name: 'weather.png', content: canvasBuffer },
            'fields': [
                {name: 'Timezone :alarm_clock:', value: `${locationData.tz_name} (${locationData.tz_short_name})`, inline: true},
                {name: 'Sunrise :city_sunset:', value: datetime.dateToTimeOfDay(sunriseDate), inline: true},
                {name: 'Sunset :night_with_stars:', value: datetime.dateToTimeOfDay(sunsetDate), inline: true}
            ],
            'footer': 'Powered by OpenCage & OpenWeatherMap'
        };
        let embed = await createEmbed(options);
    
        await sentMessage.delete();
        msg.channel.send(embed);
    });
}