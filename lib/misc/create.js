const { createCanvas, loadImage, registerFont } = require('canvas');
const { CanvasRenderService } = require('chartjs-node-canvas');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { ChartDataLabels } = require('chartjs-plugin-datalabels');


const datetime = require('./datetime.js');
const color = require('../static/color.json');
const { fetchIcon } = require('../tracker/icons.js');

registerFont('lib/static/fonts/NotoSans-Regular.ttf', { family: 'Noto Sans' });
registerFont('lib/static/fonts/NotoSans-Bold.ttf', { family: 'Noto Sans Bold' });

const renderServices = {
    '390x24': new CanvasRenderService(390, 24),
    '780x48': new CanvasRenderService(780, 48),
    '1560x96': new CanvasRenderService(1560, 96)
};
function renderChartCanvas(configuration, dim) {
    return renderServices[dim].renderToBuffer(configuration);
}

// EXPORTS

module.exports.createEmbed = async function(options) {
    let o = options, embed = new MessageEmbed();
    if(o.author) { o.author.length>1 ? embed.setAuthor(o.author[0], o.author[1]) : embed.setAuthor(o.author[0]) }
    if(o.title) { embed.setTitle(o.title); }
    if(o.color) { embed.setColor(color[o.color]); }
    if(o.description) { embed.setDescription(o.description); }
    if(o.fields) { embed.addFields(o.fields); }
    if(o.attachment) {
        let attachment = new MessageAttachment(o.attachment.content, o.attachment.name);
        embed.attachFiles(attachment);
        embed.setImage(`attachment://${o.attachment.name}`);
    }
    if(o.footer) { embed.setFooter(o.footer); }
    return embed;
}

module.exports.createCanvasWeatherForecast = async function(locationData, weather, scale=4) {
    let formatted_string = locationData.formatted_string;

    while(formatted_string.length >= 36) {
        let strList = formatted_string.split(',');
        strList.pop();
        formatted_string = strList.join(',');
    }

    let currentDate = datetime.shiftToTimezone(new Date(weather.current.dt * 1000), locationData.tz_offset);
    let cDateDay = datetime.DAYS[currentDate.getUTCDay()];
    let cDateString = cDateDay + ' ' + datetime.dateToTimeOfDay(currentDate);

    let minHourlyTemp = Math.min(...weather.hourly.map(obj => obj.y));
    let adjustedHourlyWeather = weather.hourly.map(obj => {
        return { t: obj.t, y: obj.y - minHourlyTemp };
    });

    const W = scale * 400, H = scale * 300, S = scale;
    let canvas = createCanvas(W, H);
    let ctx = canvas.getContext('2d');
    // background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // location name
    ctx.fillStyle = '#999999';
    ctx.font = `${S * 20}px Noto Sans`;
    ctx.fillText(formatted_string, W*0.02, H*0.1);
    // day + time
    ctx.font = `${S * 10}px Noto Sans`;
    ctx.fillText(cDateString, W*0.02, H*0.16);
    // weather description
    ctx.fillText(weather.current.weatherDescription.capitalize(), W*0.02, H*0.21);

    // main icon
    let mainIcon = fetchIcon(weather.current.weatherIcon);
    ctx.drawImage(mainIcon, 0, H*0.22, S*80, S*80);
    // current temp
    ctx.fillStyle = '#444444';
    ctx.font = `${S*36}px Noto Sans`;
    ctx.fillText(`${Math.round(weather.current.temp)}°C`, W*0.18, H*0.395);

    // top-right descriptions
    ctx.font = `${S*10}px Noto Sans`;
    ctx.fillStyle = '#eeeeee';
    //ctx.fillRect(W*0.58, H*0.175, W*0.3, H*0.225);
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText(`Feels Like: ${weather.current.feelsLike}°`, W*0.58, H*0.2);
    ctx.fillText(`Humidity: ${weather.current.humidity}%`, W*0.58, H*0.24);
    ctx.fillText(`Wind: ${Math.round(weather.current.windSpeed*3.6)} km/h`, W*0.58, H*0.28);
    ctx.fillText(`UV-index: ${weather.current.uvi}`, W*0.58, H*0.32);
    // SUNSET
    // SUNRISE

    // GRAPH START
    let configuration = { // graph config
        type: 'line',
        data: {
            datasets: [{
                data: adjustedHourlyWeather,
                borderColor: '#ffcc00',
                backgroundColor: '#fff5cc',
                pointRadius: 0,
                lineTension: 0.6
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'hour'
                    },
                    gridLines: {
                        display: false
                    },
                    display: false
                }],
                yAxes: [{
                    display: false
                }]
            }
        }
    };

    let temperatureGraph = await loadImage(await renderChartCanvas(configuration, `${S*390}x${S*24}`));
    ctx.drawImage(temperatureGraph, W*0.012, H*0.57, S*390, S*24);

    ctx.fillStyle = '#fff5cc';
    ctx.fillRect(W*0.012, H*0.57 + S*24, S*390, S*16);

    let adjustedMaxHourlyTemp = Math.max(...adjustedHourlyWeather.map(obj => obj.y));
    for(let i=0; i<adjustedHourlyWeather.length; i++) {
        if(i%3 === 1) {
            // temperature on graph
            let y = H*0.62 - (S*22*adjustedHourlyWeather[i].y/adjustedMaxHourlyTemp);
            ctx.fillStyle = '#aaaaaa';
            ctx.font = `${S*6}px Noto Sans Bold`;
            ctx.fillText(Math.round(weather.hourly[i].y), W*0.013 + i*S*16.1, y);
            // precipitation chance on graph
            ctx.font = `${S*6}px Noto Sans`;
            ctx.fillStyle = '#1878f0';
            ctx.fillText(Math.round(weather.hourly[i].pop*10)*10+'%', W*0.013 + i*S*16.1, H*0.69);
            // hours below graph
            let d = new Date(weather.hourly[i].t);
            let hour = d.getUTCHours()%12!==0 ? d.getUTCHours() : d.getUTCHours()+12;
            ctx.fillStyle = '#bababa';
            ctx.fillText(hour>12 ? hour-12 + ' p.m.' : hour + ' a.m.', W*0.012 + i*S*16.1, H*0.735);
        }
        if(i<8) {
            // date row
            let dayText = datetime.DAYS[weather.daily[i].t.getUTCDay()].substring(0, 3) + '.';
            ctx.font = `${S*8}px Noto Sans`;
            ctx.fillStyle = '#888888';
            ctx.fillText(dayText, W*0.05 + i*S*48.7, H*0.8);
            // icon row
            let icon = fetchIcon(weather.daily[i].weatherIcon);
            ctx.drawImage(icon, W*0.018 + i*S*48.7, H*0.79, S*40, S*40);
            // max temp row
            ctx.font = `${S*6}px Noto Sans`;
            ctx.fillStyle = '#999999';
            ctx.fillText(Math.round(weather.daily[i].maxTemp) + '°', W*0.045 + i*S*48.7, H*0.94);
            // min temp row
            ctx.fillStyle = '#bbbbbb';
            ctx.fillText(Math.round(weather.daily[i].minTemp) + '°', W*0.075 + i*S*48.7, H*0.94);
        }
    }
    // GRAPH END

    return canvas.toBuffer();
}