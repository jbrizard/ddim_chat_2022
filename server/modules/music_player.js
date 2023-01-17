/*
 * Nom : Music youtube player
 * Description : Ce module permet de jouer la bande audio d'une vidéo Youtube
 * Auteur(s) : Dorian MOREL
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
	handleMusicYoutube: handleMusicYoutube // permet d'appeler cette méthode dans server.js -> musicYoutube.handleMusicYoutube(...)
}

/**
 * Si l'on tape la commande /music arguments, la fonction se déclenche
 */
function handleMusicYoutube(io, message)
{
    // Passage du message reçu en minuscules
    message = message.toLowerCase();

    // Séparation du message pour déterminer si l'utilisateur a correctement écrit la commande
    var demande = message.split("/music");

    // Si le message est composée de "/music" ET qu'il n'y a rien AVANT "/music"
    if ( (message.includes('/music')) && message.split("/music")[0] == '') 
    {

        // Transmission du message, composée de la balise audio, et d'un message qui inclus le lien de la vidéo trouvée
        io.sockets.emit('new_message',
        {
            name:'YoutubeMusic',
            message:'<span>Si l\'audio est \"vide\", voici le lien de la musique que j\'ai trouvée : <a class="ytb_link" target="_blank"></a></span>'
                   +'<audio class="youtube" autoplay controls loop></audio>'
        });

        // On récupère les paramètres de la commande
        var demande = demande[1];

        // Appel à l'API de Youtube pour ainsi rechercher une vidéo conforme à la demande de l'utilisateur
        var YouTube = require('youtube-node');
        var ytb = new YouTube();
        ytb.setKey('AIzaSyAT5zizzUqIxL3o0hYtA7bFOwFIqtb91O4');
        ytb.addParam('type', 'video');

        // On génère la recherche et on obtien le premier résultat de la recherche
        ytb.search(demande, 1, function(error, result) 
        {
            if (error) 
            {
                console.log(error);
            }
            else 
            {
                try 
                {
                    io.sockets.emit('activate_youtube_music', result["items"][0]["id"]["videoId"]);
                } 
                catch (error) 
                {
                    console.log(error);
                }
            }
        });
    }

}