/*
 * Nom : Users
 * Description :
 * Auteur(s) : 
 */

// différents status de connextion d'un utilisateur
const connectionStatus = {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
}

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
    connectionStatus: connectionStatus,
	addUser: addUser, // permet d'appeler cette méthode dans server.js -> daffy.handleDaffy(...)
    notifyUser: notifyUser, //Permet d'ajouter un message de notification d'arrivée d'un nouvel user dans le chat
    updateUsersList: updateUsersList,
}

// Initialisation des users 
var connectedUsers = [];

/**
 * Ajoute un utilisateur
 */
function addUser(socket) 
{
    if(!checkIfUserExists(socket)) {
        connectedUsers.push({
            id: socket.id,
            name: socket.name,
        });
        // Log --
        console.log(`✅ Success: Added user ${socket.name}`);
    }
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
 * Emission d'un message de nofication de connection/déconnection d'un user
 */
function notifyUser(io, socket, type) 
{
    io.sockets.emit('notify_user', {
        type: type,
        userId: socket.id,
        users: connectedUsers
    });
}