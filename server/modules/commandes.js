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
function handleCommandes(io, message, socket)
{
	// Passe le message en minuscules (recherche insensible à la casse)
    let newMessage = '';

    switch(message.toLowerCase())
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
            newMessage = '<br> <strong>Commandes disponibles : <br> /tableflip :</strong> (╯°□°）╯︵ ┻━┻ <br> <strong>/unflip :</strong> ┬─┬﻿ ノ( ゜-゜ノ) <br> <strong>/shrug :</strong> ¯\\_(ツ)_/¯ <br> <strong>/lenny :</strong> ( ͡° ͜ʖ ͡°) <br> <strong>/youtube Vidéo à regarder :</strong> Affiche la vidéo à regarder <br> <strong>/sondage Question? Réponse1 & Réponse2 :</strong> Propose un sondage avec 2 réponses possibles <br> <strong>/musique Nom de la musique :</strong> Permet d\'écouter une musique ';

            const msg = {name:socket.name, message:newMessage, senderId: socket.id};
            io.to(socket.id).emit('new_message', msg);
            //Renvoie le message au serveur
            return null;
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
