const axios = require('axios')

module.exports = {
    handleGif: handleGif
}

async function handleGif(search)
{
    const res = await axios.get('https://api.giphy.com/v1/gifs/search',{
        params: {
            api_key: "HFhsSjvigblJmQQyUaeVpq6pMRsXxba4",
            q: search,
            limit: 20
        }
    })
    return await res.data?.data;
}
