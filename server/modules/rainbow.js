module.exports = {
    handleRainbow: handleRainbow

}
function handleRainbow(io, message){

    message = message.toLowerCase();

    if (message.includes('hello')){

        io.sockets.emit('change_background');
    }
}