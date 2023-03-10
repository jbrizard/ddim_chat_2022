/*
 * Nom : ChatGPT !
 * Description : Ce module ne fait pas grand chose... quand on appelle ChatGPT, il répond !
 * Auteur(s) : Jérémie Brizard
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
    handleMessage: handleMessage // permet d'appeler cette méthode dans server.js -> ChatGPT.handleChatGPT(...)
}


const { Configuration, OpenAIApi } = require("openai");
OPENAI_API_KEY="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" //attribution de la clé API Open AI

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

/**
 * Lorsqu'on appelle ChatGPT, il répond...
 */

function handleMessage (io, message)
{
    // Passe le message en minuscules (recherche insensible à la casse)
    message = message.toLowerCase();

    // Est-ce qu'il contient une référence à ChatGPT ?
    if (message.includes('/chatgpt'))
    {
        message = message + 'répond avec le moins de mot possible';
        var question = message.substr(8);

        var completion = openai.createCompletion({
            model: "text-davinci-003",
            prompt: question,
            max_tokens: 25,
        })
        .then(function(result){
            // Si oui, envoie la réponse de ChatGPT...
            io.sockets.emit('new_message',
                {
                    name: 'ChatGPT',
                    message:  '<span class="ChatGPT">'+ result.data.choices[0].text +'</span>',
                    avatar: "<img src='/modules/avatar/bot.png' alt='Bot avatar' width='30px'>"
                });
        });
    }
}