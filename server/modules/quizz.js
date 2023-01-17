module.exports = {
    handleQuizz: handleQuizz
}

function handleQuizz(io, message){
    message = message.toLowerCase();
    if (message.includes('quizz') || message.includes('quiz') || io.sockets.quizz === true){
        io.sockets.quizz = true;

        if (message.includes('oui') || message.includes('yes')){

        }else if (message.includes('non') || message.includes('no')){

        } else if (message.includes('stop') || message.includes('fin')){
            io.sockets.quizz = false;
        }else {
            messagePerso(io,'Veuillez répondre par oui ou non');
        }
    }
}

function messagePerso(io, message)
{
    io.sockets.emit('new_message',
        {
            name:'M.Quizz',
            message:'<span class="spiderman"> ' + message + '</span>',
            avatar:"<img src='/modules/avatar/quizz.svg' alt='Spiderman avatar' width='30px'>"
        });
}
