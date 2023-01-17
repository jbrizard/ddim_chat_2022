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
    console.log(process.env['OPENAI_APIKEY']);
    if(rules(socket,message))
    {
        sentiment(message).then((res)=>{
            //console.log("Résultat OPEN AI :");
            //console.log(res.data['choices'][0]);
            if(res.data['choices'][0].text.includes('1'))
            {
                const resps = [
                    'Mange ce gros ratio sale looser',
                    'AHAHA! T\'es trop une merde + big ratio sur toi',
                    'Ton père a bien fait de partir quand tu étais encore enfant espèce de sous-humain. Ratio + longue vie à Booba.',
                    'RATIO AHAHAHA',
                    'Tu feras gaffe tu as laissé tombé ce ratio gros looser.'
                ]
                io.sockets.emit('new_message', {
                    name:"Ratio",
                    message:resps[Math.floor(Math.random()*resps.length)],
                    avatar: "<img src='/modules/avatar/bot.png' alt='Bot avatar' width='30px'>"
                });
            }
        }).catch((err)=>{
            console.log(err);
        })
    }

}

function rules(socket, message)
{
    if((process.env['ACTIVATE_RATIO_BOT']??false))
        return false;

    if(message.split(' ').length < 3)
        return false;

    if(Math.floor(Math.random()*10) >= 7)
        return false;

    if(message.startsWith(socket.name) || message.startsWith('@'))
        return false;

    return true;
}

async function sentiment(message)
{
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "In french, Ce text fait-il preuve de tristesse ? Si oui, répond 1, si non, répond 0 : "+message,
        temperature: 0.7,
        max_tokens: 4,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    });
    return response;
}