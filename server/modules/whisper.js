module.exports = {
    handleMessage: handleMessage
}

function handleMessage(io, socket, message, users)
{
    let cmd = message.split(' ');

    if (cmd.length < 3 || cmd[0] !== "/mp")
        return false;

    const socketId = getSocketId(cmd[1], users);

    if (socketId === null)
        return true;

    if (socketId === socket.id)
        return true;

    cmd.shift();
    cmd.shift();
    message = cmd.join(' ');

    let opts = {
        name: socket.name,
        type: 'whisper',
        message: message,
        senderId: socket.id
    };

    io.to(socketId).emit('new_message', opts);

    io.to(socket.id).emit('new_message', opts);

    return true;
}

function getSocketId(name, users)
{
    if (name[0] === '@')
        name = name.substring(1);

    for (const [key, user] of Object.entries(users))
    {
        if (user.name === name)
            return key
    }

    return null;
}