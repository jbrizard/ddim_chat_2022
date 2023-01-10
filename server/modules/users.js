/*
 * Nom : Users
 * Description :
 * Auteur(s) : 
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
	addUser: addUser, // permet d'appeler cette méthode dans server.js -> daffy.handleDaffy(...)
    notifyUserEnter: notifyUserEnter
}

// Initialisation des users 
var connectedUsers = [];

/**
 * Ajoute un utilisateur
 */
function addUser(socket) 
{
    if(!checkIfUserExists(socket)) {
        connectedUsers[socket.id] = socket;
        console.log(`✅ Success: Added user ${socket.name}`);
    }
}

/**
 * Supprime un utiisateur
 */
function removeUser(socket) 
{
    delete connectedUsers[socket.id];
}

/**
 * Methode vérifiant si l'utilisateur n'existe pas déjà
 */
function checkIfUserExists(socket) 
{
    return (typeof(connectedUsers.find((s) => 
        s.id === socket.id
    )) !== 'undefined');
}

/**
 * Emission d'un message de nofication de connection d'un nouvel user
 */
function notifyUserEnter(io, socket) 
{
    io.sockets.emit('new_message', {name: 'bot', message: `${socket.name} s'est connécté...`});
}