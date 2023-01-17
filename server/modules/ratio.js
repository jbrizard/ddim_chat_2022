const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env['OPENAI_APIKEY'],
});
//apiKey: process.env.OPENAI_API_KEY,
const openai = new OpenAIApi(configuration);

module.exports = {
    handleMessage: handleMessage,
}

function handleMessage(io, socket, message)
{
    if((process.env['ACTIVATE_RATIO_BOT']??false))
    {
        if(Math.floor(Math.random()*10) >= 7)
        {
            if(message.startsWith(socket.name) || message.startsWith('@'))
                return;

            sentiment(message).then((res)=>{
                console.log("Résultat OPEN AI :");
                console.log(res.data['choices'][0]);
                if(res.data['choices'][0].text.includes('1'))
                {
                    const resps = [
                        'Mange ce gros ratio sale looser',
                        'AHAHA! T\'es trop une merde + big ratio sur toi',
                        'Ton père a bien fait de partir quand tu étais encore enfant espèce de sous-humain. Ratio + longue vie à Booba.',
                        'RATIO AHAHAHA',
                        'Tu feras gaffe tu as laissé tombé ce ratio gros looser.'
                    ]
                    io.sockets.emit('new_message', {name:"Ratio", message:resps[Math.floor(Math.random()*resps.length)]});
                }
            }).catch((err)=>{
                console.log(err);
            })
        }
    }
}

async function sentiment(message)
{
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "In french, renvoi moi 1 si le message est triste, ou 0 si le message ne l'est pas : "+message,
        temperature: 0,
        max_tokens: 15,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    });
    return response;
}