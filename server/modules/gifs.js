const axios = require('axios')

module.exports = {
    handleGif: handleGif,
    handleGifMessage: handleGifMessage,
    handleTrendingGif: handleTrendingGif
}
/**
* Recherche des gifs via l'API giphy
 */
async function handleGif(search, offset = 0)
{
    const res = await axios.get('https://api.giphy.com/v1/gifs/search',{
        params: {
            api_key: "HFhsSjvigblJmQQyUaeVpq6pMRsXxba4",
            q: search,
            limit: 20,
            offset: (offset*20)
        }
    })
    return await res.data?.data;
}

/**
* Récupération des trendings depuis l'API giphy
 */
async function handleTrendingGif()
{
    const res = await axios.get('https://api.giphy.com/v1/gifs/trending',{
        params: {
            api_key: "HFhsSjvigblJmQQyUaeVpq6pMRsXxba4",
            limit: 25
        }
    })
    return await res.data?.data;
}

/**
 * Envoi de l'image dans le chat
 */
function handleGifMessage(io, name, url)
{
    // Si oui, envoie la réponse de Daffy...
    io.sockets.emit('new_message',
        {
            name:name,
            message:'<img class="gif" src="'+url+'" />'
        });

}