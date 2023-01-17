/*
 * Nom : Daffy !
 * Description : Ce module ne fait pas grand chose... quand on appelle Daffy, il répond !
 * Auteur(s) : Jérémie Brizard
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
	handleHelp: handleHelp // permet d'appeler cette méthode dans server.js -> daffy.handleDaffy(...)
}

/**
 * Lorsqu'on appelle Daffy, il répond...
 */
function handleHelp(io, message)
{
	// Passe le message en minuscules (recherche insensible à la casse)
	message = message.toLowerCase();
	
	// Est-ce qu'il contient une référence à Daffy ?
	if (message.includes('?'))
	{
		// Si oui, envoie la réponse de Daffy...
		io.sockets.emit('new_message',
		{
			name:'Help!!',
			message:'<span class="Help">Coin Coin !</span>'
		});
	}
}
