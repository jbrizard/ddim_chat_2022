/*
 * Nom : Daffy !
 * Description : Ce module ne fait pas grand chose... quand on appelle Daffy, il répond !
 * Auteur(s) : Jérémie Brizard
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
const avatar = require("./avatar");
module.exports =  {
	handleDaffy: handleDaffy // permet d'appeler cette méthode dans server.js -> daffy.handleDaffy(...)
}

/**
 * Lorsqu'on appelle Daffy, il répond...
 */
function handleDaffy(io, message)
{
	// Passe le message en minuscules (recherche insensible à la casse)
	message = message.toLowerCase();
	
	// Est-ce qu'il contient une référence à Daffy ?
	if (message.includes('daffy'))
	{
		// Si oui, envoie la réponse de Daffy...
		io.sockets.emit('new_message',
		{
			name:'Daffy!!',
			message:'<span class="daffy">Coin Coin !</span>',
			avatar: "<img src='/modules/avatar/bot.png' alt='Bot avatar' width='30px'>"
		});
	}
}
