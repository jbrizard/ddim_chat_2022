/*
 * Nom : historisation des messages
 * Description : 
 * Auteur(s) : David Golay & Justin Sornay
 */

const __messagesListPath = './modules/messagesHistory/messageList.json';
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
            creationDate: new Date(Date.now()),
            reactions: [],
        }
    
        messageList.push(messageToStore);
        addMessageToStorage(messageToStore);
       
    } catch (error) {
        console.log(error);
    }
}

function addMessageToStorage(messageToStore) {
    //Storage
    try {
        const json = JSON.stringify(messageList);
        fs.writeFile(__messagesListPath, json, 'utf8', () => {});

        console.log(`✅ Success: Added message to history`);
    } catch (storageError) {
        console.log('❌ Storing failed');
        console.log(storageError);
    }
}

/**
*
**/
function generateNewMessageId() {
    let generatedId = null;
    generatedId = messageList.length;
    return generatedId;
}

/**
 * 
 */
async function getAllMessages(sockets) {
    const storedList = getAllMessagesFromStorage();
    sockets.emit('get_messages_history', storedList);
}

/**
 * Récupère la liste de messages depuis le JSON de stockage
 */
 function getAllMessagesFromStorage() {
    let res = [];
    try {
        const data = fs.readFileSync(__messagesListPath, 'utf8', {encoding:'utf8', flag:'r'});
        res = JSON.parse(data);
    } catch(error) {
        console.dir('❌');
    }
    return res;
}

/**
 * Vide l'historique
 */
function emptyHistory(socket) {
    // Log --
    console.log(`✅ Success: Emptied message history`);
}