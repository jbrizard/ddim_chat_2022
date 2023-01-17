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

    switch(message)
    {
        case '/tableflip':
        {
            //Transforme le message
            newMessage = '(╯°□°）╯︵ ┻━┻';

            //Renvoie le message au serveur
            return newMessage;
        }
        case '/shrug':
        {
            //Transforme le message
            newMessage = '¯\\_(ツ)_/¯';

            //Renvoie le message au serveur
            return newMessage;
        }
        case '/lenny':
        {
            //Transforme le message
            newMessage = '( ͡° ͜ʖ ͡°)';

            //Renvoie le message au serveur
            return newMessage;
        }
        case '/unflip':
        {
            //Transforme le message
            newMessage = '┬─┬﻿ ノ( ゜-゜ノ)';

            //Renvoie le message au serveur
            return newMessage;
        }
        case '/help':
        {
            //Transforme le message
            newMessage = '<br> Commandes disponibles : <br> /tableflip : (╯°□°）╯︵ ┻━┻ <br> /unflip : ┬─┬﻿ ノ( ゜-゜ノ) <br> /shrug : ¯\\_(ツ)_/¯ <br> /lenny : ( ͡° ͜ʖ ͡°)';

            //Renvoie le message au serveur
            return newMessage;
        }
        default: 
        {
            //Si le message ne correspond à aucune commande, on le renvoie tel quel
            newMessage = message;

            //Renvoie le message au serveur
            return newMessage;
        }
    }
}
