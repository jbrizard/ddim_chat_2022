// Chargement des modules perso
socket.on('get_messages_history', getMessagesHistory);

const historyFiltered = [];
let step = -1;

function initHistory(messages) {
    for (const message of messages) {
        if (socket.id === message.senderId) {
            historyFiltered.push(message);  
        }  
    }
    step = historyFiltered.length;
}

function showPreviousMessage(messageInput) {
    step = (step-1 > 0) ? step - 1 : 0;

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
    const messageInput = $('#message-input');
    messageInput.addEventListener('onkeydown', (e) => {
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