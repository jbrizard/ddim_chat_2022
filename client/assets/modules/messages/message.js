// Chargement des modules perso
let history = [];
let step = -1;

function initHistory() 
{
    if (typeof(localStorage.history) !== 'undefined') 
    {
        const newHistory = JSON.parse(localStorage.history);

        if (history.length !== newHistory.length) 
        {
            step = newHistory.length;
        }

        history = newHistory;
    }
}

function showPreviousMessage(messageInput) 
{
    if (step-1 > 0) 
    {
        step--;
    }
    else
    {
        step = 0;
    }
    if (typeof(history[step]) !== 'undefined') {
        messageInput.value = history[step];
    }
}

function showNextMessage(messageInput) 
{
    if (step < history.length-1) 
    {
        step++;
    }
    else
    {
        step = history.length-1;
    }
    if (typeof(history[step]) !== 'undefined') 
    {
        messageInput.value = history[step];
    }
}

function init() 
{
    const messageInput = document.querySelector('#message-input');
    messageInput.addEventListener('keydown', (e) => {
        initHistory();
        switch (e.keyCode) {
            case 38: {
                e.preventDefault();
                showPreviousMessage(messageInput);
                break;
            }
            case 40: {
                e.preventDefault();
                showNextMessage(messageInput);
                break;
            }
        }
    });
}
init();