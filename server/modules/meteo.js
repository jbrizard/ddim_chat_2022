const axios = require('axios')

module.exports = {
    handleMessage: handleMessage,
}

/**
 * Recherche des coordonnées de la ville puis requete de l'API OpenWeatherMap
 */
function handleMessage(io,socket, message)
{
    var city = new RegExp('^\/meteo ([A-Za-zÀ-ÖØ-öø-ÿ \-]*)$');
    var result = city.exec(message.trim());

    if (result == null)
        return;

    // get city
    getCityLatLong(result[1]).then(function(res)
    {
        if (res.length === 0)
        {
            io.to(socket.id).emit('new_message', {
                name:"Météo",
                message:"<em>La ville n'a pas été trouvée.\r\n Merci d'utiliser /meteo Nom de la ville.</em>",
                avatar: "<img src='/modules/avatar/bot.png' alt='Bot avatar' width='30px'>"
            });
            return;
        }

        let lat = res[0].lat;
        let long = res[0].lon;

        getMeteo(lat,long).then(function (res)
        {
            let responseMsg = '<div class="meteo-wrapper">\n' +
                '   <div class="meteo-icon">\n' +
                '     <img src="http://openweathermap.org/img/wn/'+res.weather[0].icon+'@2x.png" />\n' +
                '  </div>\n' +
                '  <div class="meteo-infos">\n' +
                '    <span class="m-city">'+res.name+'</span>\n' +
                '    <span>'+res.weather[0].description[0].toUpperCase()+ res.weather[0].description.substring(1)+'</span>\n' +
                '  </div>\n' +
                '  <div class="meteo-temp">\n' +
                '    <span>'+(Math.round(res.main?.temp) ?? '?')+'°</span>C\n' +
                '  </div>\n' +
                '</div>';

            io.sockets.emit('new_message', {
                name:"Météo",
                message:responseMsg,
                avatar: "<img src='/modules/avatar/bot.png' alt='Bot avatar' width='30px'>"
            });
        })
        .catch(function (error)
        {
            io.to(socket.id).emit('new_message', {
                name:"Météo",
                message:"<em>Le bot météo est indisponible pour le moment :(</em>",
                avatar: "<img src='/modules/avatar/bot.png' alt='Bot avatar' width='30px'>"
            });
        });
    });
}

async function getCityLatLong(city)
{
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
            city: city,
            format: 'jsonv2',
        }
    });
    return await res.data;
}

async function getMeteo(lat, long)
{

    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            lat: lat,
            lon: long,
            units: "metric",
            appid: process.env['OPEN_WEATHER_MAP_APIKEY'],
            lang: "fr"
        }
    });
    return await res.data;
}