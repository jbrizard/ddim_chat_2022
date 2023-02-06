module.exports = {
    handleSmiley: handleSmiley

}

function handleSmiley(io, message){
    message = message.toLowerCase();

    message = message.replace(':)', '😀');
    message = message.replace(':(', '🙁');
    message = message.replace('8)', '😎');
    message = message.replace(';)', '😉');
    message = message.replace(':]', '😁');
    message = message.replace(':|', '😑');
    message = message.replace(':c', '👋');
    message = message.replace(';/', '😜');
    message = message.replace(':3', '😍');
    message = message.replace(':1', '👍');
    message = message.replace(':0', '👎');
    return message;
}