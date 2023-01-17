module.exports = {
    handleCoiffeur: handleCoiffeur,
}
/**
 * Recherche de "quoi" dans les messages
 */
function handleCoiffeur(io, socket, message)
{
    endsWith = ['quoi', 'quoi.', "quoi .", "quoi?", "quoi ?", "quoi!", "quoi !", "koi","koi.",'koi?','koi ?','koi!','koi !'];
    endsWith.forEach(function (quoi){
        if(message.toLowerCase().endsWith(quoi)){
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
