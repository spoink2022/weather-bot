const fetch = require('node-fetch');

const keys = require('../../private/keys.json');

const { shiftToTimezone } = require('./datetime');

module.exports.geocode = async function(placeName) {
    let response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${placeName}&limit=1&key=${keys.opencage}`);
    response = await response.json();
    let res = response.results[0];

    if(!res) { return false; }

    return {
        'tz_name': res.annotations.timezone.name,
        'tz_short_name': res.annotations.timezone.short_name,
        'tz_offset': res.annotations.timezone.offset_sec,
        'lat': res.geometry.lat,
        'lon': res.geometry.lng,
        'formatted_string': res.formatted
    };
}

module.exports.getWeatherFromCoords = async function(lat, lon, tz_offset) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${keys.openweathermap}`);
    response = await response.json();
    let current = response.current, hourly = response.hourly, daily = response.daily;

    return {
        current: {
            dt: current.dt,
            temp: current.temp,
            weatherDescription: current.weather[0].description,
            weatherIcon: current.weather[0].icon,
            feelsLike: current.feels_like,
            humidity: current.humidity,
            windSpeed: current.wind_speed,
            uvi: current.uvi,
            sunrise: current.sunrise,
            sunset: current.sunset
        },
        hourly: hourly.map(obj => {
            return {t: shiftToTimezone(new Date(obj.dt*1000), tz_offset), y: obj.temp, pop: obj.pop};
        }).splice(0, 25),
        daily: daily.map(obj => {
            return {
                t: shiftToTimezone(new Date(obj.dt*1000), tz_offset),
                minTemp: obj.temp.min,
                maxTemp: obj.temp.max,
                weatherIcon: obj.weather[0].icon
            };
        })
    };
}