/*
 * Nom : EasterEggs !
 * Description : Ce module ne fait pas grand chose... quand on appelle EasterEggs, il répond !
 * Auteur(s) : Jérémie Brizard & Clément EHINGER
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
	handleEasterEggs: handleEasterEggs// permet d'appeler cette méthode dans server.js -> EasterEggs.handleEasterEggs(...)
}

/**
 * Lorsqu'on appelle EasterEggs, il répond...
 */
function handleEasterEggs(io, message)
{
	// Passe le message en minuscules (recherche insensible à la casse)
	message = message.toLowerCase();

	// Est-ce qu'il contient une référence à Clément, Justin, David, Romain ou Lucien?
	if (message.includes('cl&#233;ment') || message.includes('clement'))
	{
		// Si oui, envoie la réponse de EasterEggs...
		io.sockets.emit('new_message',
		{
			name:'EasterEggs',
			message:'<br><img src="modules/eastereggs/Clement.jpg">'
		});
	}
	else if (message.includes('justin'))
	{
		// Si oui, envoie la réponse de EasterEggs...
		io.sockets.emit('new_message',
		{
			name:'EasterEggs',
			message:'<br><img src="modules/eastereggs/Justin.jpg">'
		});
	}
	else if (message.includes('david'))
	{
		// Si oui, envoie la réponse de EasterEggs...
		io.sockets.emit('new_message',
		{
			name:'EasterEggs',
			message:'<br><img src="modules/eastereggs/David.jpg">'
		});
	}
	else if (message.includes('romain'))
	{
		// Si oui, envoie la réponse de EasterEggs...
		io.sockets.emit('new_message',
		{
			name:'EasterEggs',
			message:'<br><img src="modules/eastereggs/Romain.jpg">'
		});
	}
	else if (message.includes('lucien'))
	{
		// Si oui, envoie la réponse de EasterEggs...
		io.sockets.emit('new_message',
		{
			name:'EasterEggs',
			message:'<br><img src="modules/eastereggs/Lucien.jpg">'
		});
	}
}
