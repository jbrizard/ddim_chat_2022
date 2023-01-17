// Chargement des modules perso
var chat = require('../../chat.js');
socket.on('get_messages_history', getMessagesHistory);

const historyFiltered = [];

function initHistory(messages) {
    for (const message of messages) {
        historyFiltered.push({
            
        });    
    }
}

function showPreviousMessage() {

}

function showNextMessage() {

}

function getMessagesHistory(messages) {
    initHistory(messages);
    const messageInput = $('#message-input');
    messageInput.addEventListener('onkeydown', (e) => {
        switch (e.keyCode) {
            case 38: {
                showPreviousMessage();
                break;
            }
            case 40: {
                showNextMessage();
                break;
            }
        }
    });
}