module.exports = {
    handleCoiffeur: handleCoiffeur,
}
/**
 * Recherche de "quoi" dans les messages
 */
function handleCoiffeur(io, socket, message)
{
    const messageFormatted = message.replace(/[^a-zA-Z]/g, '');
    endsWith = ['quoi', 'koi', 'coi', 'qoua', 'quoua', 'coua', 'koua', 'cuoua', 'kuoua', 'kaw', 'quaw', 'qoi', 'qaw', 'caw', 'cuaw', 'kuaw'];
    endsWith.forEach(function (quoi){
        if(messageFormatted.toLowerCase().endsWith(quoi)){
            setTimeout(function(){
                io.sockets.emit('new_message',
                    {
                        name:"Coiffeur",
                        message:'<img class="gif" src="https://media.tenor.com/zvg8w0FkecYAAAAC/feur-theobabac.gif" />',
                        senderId: "bot"
                    });
            },150);
        }
    });
}