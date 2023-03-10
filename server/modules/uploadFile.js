/*
 * Nom : Daffy !
 * Description : Ce module ne fait pas grand chose... quand on appelle Daffy, il répond !
 * Auteur(s) : Jérémie Brizard
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
    sendFile: sendFile, // permet d'appeler cette méthode dans server.js -> daffy.handleDaffy(...)
}

/**
 * Action a exécuter lors d'un envoie de fichier
 */
function sendFile (io, file, name, user)
{
    const fs = require('fs');
    // On enregistre le fichier dans un dossier
    fs.writeFile('../client/assets' +'/files/'+ name , file, {encoding: 'base64'}, function(err) {
        if(err) {
            return console.log(err);
        }
    });
    // On envoie le chemin du fichier pour que le client puisse l'utiliser
    io.sockets.emit('new_file',
        {
            link: name,
            user: user,
        });
}