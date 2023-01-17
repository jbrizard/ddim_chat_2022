/*
 * Nom : Daffy !
 * Description : Envoi d'un gif après une recherche menée par l'utilisateur
 * Auteur(s) : Dorian MOREL
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
	handleTenor: handleTenor // permet d'appeler cette méthode dans server.js -> tenor.handleTenor(...)
}

/**
 * Lorsqu'on appelle Tenor, on réalise un traitement
 */
function handleTenor(io, message)
{
	// Passe le message en minuscules (recherche insensible à la casse)
	message = message.toLowerCase();
	
	// Est-ce qu'il contient une référence à Tenor ?
	if (message.includes('/tenor'))
	{   
        if ( (message.includes('/tenor')) && message.split("/tenor")[0] == '') 
        {
            // On set la clé API et la limite
            var apiKey = "LIVDSRZULELA";
            var limit = 8;

            // Séparation de la commande des éléments de recherche
            var searchTerm = message.split("/tenor ");

            // Définition de l'URL de recherche
            var search_url = "https://g.tenor.com/v1/search?q=" + searchTerm + "&key=" +
                    apiKey + "&limit=" + limit;

            // Emission de la réponse de Tenor
            io.sockets.emit('new_message',
            {
                name:'Tenor',
                message:"<img class='gifTenor'></img>"
            });

            // On continue le traitement en envoyant ce message au client
            io.sockets.emit('tenor_gif', search_url);
            
        }
        else 
        {
            io.sockets.emit('new_message',
            {
                name:'Tenor',
                message:"<span>Mauvaise syntaxe.</span>"
                       +"<span>Exemple : /tenor hug</span>"
            });
        }
	}
}

