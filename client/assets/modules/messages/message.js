// Chargement des modules perso
socket.on('get_messages_history', getMessagesHistory);

let historyFiltered = [];
let step = -1;

function initHistory(messages) {
    if (Array.isArray(messages)) {
        historyFiltered = messages.filter((message) => {
            console.log('socket.id', socket.id);
            console.log('message.senderId', message.senderId);
            return socket.id === message.senderId
        });
        step = historyFiltered.length;
    }
}
initHistory();

function showPreviousMessage(messageInput) {
    step = (step-1 > 0) ? step - 1 : 0;
    console.dir(historyFiltered);
    if (typeof(historyFiltered[step]) !== 'undefined') {
        messageInput.value = historyFiltered[step].message;
    }
}

function showNextMessage(messageInput) {
    step = (step < historyFiltered.length-1) ? step + 1 : historyFiltered.length-1;
    if (typeof(historyFiltered[step]) !== 'undefined') {
        messageInput.value = historyFiltered[step].message;
    }
}

function getMessagesHistory(messages) {
    initHistory(messages);
    const messageInput = document.querySelector('#message-input');
    messageInput.addEventListener('keydown', (e) => {
        switch (e.keyCode) {
            case 38: {
                showPreviousMessage(messageInput);
                break;
            }
            case 40: {
                showNextMessage(messageInput);
                break;
            }
        }
    });
}