/*
 * Nom : Spiderman !
 * Description : Ce module participe au chat
 * Auteur(s) : Clem-Enzo
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
const avatar = require("./avatar");
module.exports =  {
	handleSpider: handleSpider // permet d'appeler cette méthode dans server.js -> daffy.handleDaffy(...)
}

/**
 * Lorsqu'on appelle Spiderman, il répond...
 */
function handleSpider(io, message)
{
	// Passe le message en minuscules (recherche insensible à la casse)
	message = message.toLowerCase();
	
	// Est-ce qu'il contient une référence à Spiderman ?
	if (message.includes('spiderman'))
	{
		// Si oui, envoie la réponse de Spiderman...
		io.sockets.emit('new_message',
		{
			name:'Spiderman',
			message:'<span class="spiderman"> Un grand pouvoir implique de grandes responsabilitées.</span>',
			avatar:"<img src='/modules/avatar/spiderman.svg' alt='Spiderman avatar' width='30px'>"
		});
	}
}
