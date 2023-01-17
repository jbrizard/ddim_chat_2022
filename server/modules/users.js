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
	connectUser: connectUser, // permet d'appeler cette méthode dans server.js -> daffy.handleDaffy(...)
    disconnectUser: disconnectUser, // permet de supprimer un user de la liste des users connectés
    notifyUser: notifyUser, //Permet d'ajouter un message de notification d'arrivée d'un nouvel user dans le chat
}

// Initialisation des users 
var userList = {};

/**
 * Ajoute un utilisateur
 */
function connectUser(socket) 
{
    if(!checkIfUserExists(socket)) {
        userList[socket.id] = {
            name: socket.name,
            status: connectionStatus.CONNECTED
        };
        
        // Log --
        console.log(`✅ Success: Added user ${socket.name}`);
    } else {
        userList[socket.id].status = connectionStatus.CONNECTED;

        // Log --
        console.log(`✅ Success: Connected user ${socket.name}`);
    }
}

function disconnectUser(socket) {
    if(checkIfUserExists(socket)) {
        userList[socket.id].status = connectionStatus.DISCONNECTED;
        console.dir(userList[socket.id])
        // Log --
        console.log(`✅ Success: Disconnected user ${socket.name}`);
    }
}

/**
 * Methode vérifiant si l'utilisateur n'existe pas déjà
 */
function checkIfUserExists(socket) 
{
    return socket.id in userList;
}

/**
 * Emission d'un message de nofication de connection/déconnection d'un user
 */
function notifyUser(io, socket, type)
{
    //edition dynamque du message en fonction du connectionStatus
	let message = '';
    switch(type) 
    {
        case connectionStatus.CONNECTED: message = `${socket.name} s'est connecté...`; break;
        case connectionStatus.DISCONNECTED: message = `${socket.name} s'est déconnecté...`; break;
        default: break;
    }

    io.sockets.emit('new_message', {name:'bot', message: message, type: 'info', excludedUsers: [socket.id]});
    io.sockets.emit('notify_user', {
        type: type,
        userId: socket.id,
        users: userList
    });
}