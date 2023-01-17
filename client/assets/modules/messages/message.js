// Chargement des modules perso
let history = [];
let step = -1;

function initHistory() 
{
    if (typeof(localStorage.history) !== 'undefined') 
    {
        history = JSON.parse(localStorage.history);

        if (step === -1) 
        {
            step = history.length;
        }
    }
}

function showPreviousMessage(messageInput) 
{
    if (step-1 > 0) 
    {
        step--;
        console.dir('step--');
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
init();