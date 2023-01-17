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
        if (res.length == 0)
        {
            io.to(socket.id).emit('new_message', {
                name:"Météo",
                message:"<em>La ville n'a pas été trouvée.\r\n Merci d'utiliser /meteo Nom de la ville.</em>"
            });
            return;
        }

        let lat = res[0].lat;
        let long = res[0].lon;

        getMeteo(lat,long).then(function (res)
        {
            let responseMsg = '<div class="meteo_wrapper">\n' +
                '   <div class="meteo_icon">\n' +
                '     <img src="http://openweathermap.org/img/wn/'+res.weather[0].icon+'@2x.png" />\n' +
                '  </div>\n' +
                '  <div class="meteo_infos">\n' +
                '    <span class="m_city">'+res.name+'</span>\n' +
                '    <span>'+res.weather[0].description[0].toUpperCase()+ res.weather[0].description.substring(1)+'</span>\n' +
                '  </div>\n' +
                '  <div class="meteo_temp">\n' +
                '    <span>'+(Math.round(res.main?.temp) ?? '?')+'°</span>C\n' +
                '  </div>\n' +
                '</div>';

            io.sockets.emit('new_message', {name:"Météo", message:responseMsg});
        }).catch(function (error) {
            io.to(socket.id).emit('new_message', {
                name:"Météo",
                message:"<em>Le bot météo est indisponible pour le moment :(</em>"
            });
        });
    });
}

async function getCityLatLong(city) {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
            city: city,
            format: 'jsonv2',
        }
    });
    return await res.data;
}

async function getMeteo(lat, long) {

    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            lat: lat,
            lon: long,
            units: "metric",
            appid: "0ef45343810d76c828c055f190f83a25",
            lang: "fr"
        }
    });
    return await res.data;
}