/*
 * Nom : Commandes !
 * Description : Ce module ne fait pas grand chose... quand on appelle Commandes, il répond !
 * Auteur(s) : Jérémie Brizard & Clément EHINGER
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
	handleCommandes: handleCommandes// permet d'appeler cette méthode dans server.js -> Commandes.handleCommandes()...)
}

/**
 * Lorsqu'on appelle Commandes, il répond...
 */
function handleCommandes(io, message)
{
	// Passe le message en minuscules (recherche insensible à la casse)
	message = message.toLowerCase();
    let newMessage = '';

	console.log(message);

    switch(message)
    {
        case ('/tableflip'):
        {
            //Transforme le message
            newMessage=('(╯°□°）╯︵ ┻━┻');
            break;
        }
        default: 
        {
            //Si le message ne correspond à aucune commande, on le renvoie tel quel
            newMessage = message;
            break;
        }
    }
    //Renvoie le message au serveur
    return newMessage;
}
