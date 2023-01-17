/*
 * Nom : Konami code
 * Description : Ce module permet l'activation d'un easter egg : le konami code !
 * Auteur(s) : Dorian MOREL
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
	handleKonami: handleKonami // permet d'appeler cette méthode dans server.js -> daffy.handleDaffy(...)
}

/**
 * Si l'on tape le konami code, l'easter egg se déclenche
 */
function handleKonami(io)
{
    // Transmission du message "activate_konami", qui va permettre de déclencher le code konami
    io.sockets.emit('activate_konami');
}