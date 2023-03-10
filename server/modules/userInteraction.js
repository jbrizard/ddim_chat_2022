/*
 * Nom : Daffy !
 * Description : Ce module ne fait pas grand chose... quand on appelle Daffy, il répond !
 * Auteur(s) : Jérémie Brizard
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
    announceUser: announceUser, // permet d'appeler cette méthode dans server.js -> daffy.handleDaffy(...)
    userIsWriting: userIsWriting // permet d'appeler cette méthode dans server.js -> daffy.handleDaffy(...)
}

/**
 * Action a exécuter lorsque qu'un nouvel utilisateur arrive
 */
function announceUser (socket, name)
{
    // Envoie les données suivantes au client
    socket.broadcast.emit('announce_user',
    {
        user: name,
    });
}
/**
 * Action a exécuter lorsque qu'un utilisateur est en train d'écrire un message
 */
function userIsWriting (socket, name)
{
    // Envoie les données suivantes au client
    socket.broadcast.emit('user_tiping',
        {
            user: name,
        });
}