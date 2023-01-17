/*
 * Nom : historisation des messages
 * Description : 
 * Auteur(s) : David Golay & Justin Sornay
 */

const fs = require('fs'); //utilisé pour écrire des fichiers

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
	addToHistory: addToHistory,     // Ajoute un message à l'historique
    getAllMessages: getAllMessages, 
    emptyHistory: emptyHistory,     // Vider l'historique des messages
}

// Initialisation des users 
var messageList = [];

/**
 * Ajoute un message à l'historique
 */
function addToHistory(message) 
{
    try {
        let messageToStore = {
            id: generateNewMessageId(),
            name: message.name,
            senderId: message.senderId,
            message: message.message,
            creationDate: new Date().getDate(),
            reactions: [],
        }
    
        messageList.push(messageToStore);
    
        //Storage
        try {
            const json = JSON.stringify(messageList);
            fs.writeFile('./modules/messagesHistory/messageList.json', json, 'utf8', () => {});

            console.log(`✅ Success: Added message to history`);
        } catch (storageError) {
            console.dir('❌ Storing failed');
            console.dir(storageError);
        }

    } catch (error) {
        console.log(error);
    }
}

function generateNewMessageId() {
    let generatedId = null;
    generatedId = messageList.length;
    return generatedId;
}


function getAllMessages(sockets) {
    sockets.emit('get_messages_history', messageList);
}

/**
 * Vide l'historique
 */
function emptyHistory(socket) {
    // Log --
    console.log(`✅ Success: Emptied message history`);
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
        users: messageList
    });
}