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
	io.sockets.emit('new_message',
		{
			name:'Spiderman',
			message:'<span class="spiderman"> test4</span>',
			avatar:"<img src='/modules/avatar/spiderman.svg' alt='Spiderman avatar' width='30px'>"
		});
	messagePerso('test1');
	// Est-ce qu'il contient une référence à Spiderman ?
	if (message.includes('spiderman'))
	{
		messagePerso('test2');
			//Autre réponse de Spiderman
		if (message.includes('calcul'))
		{
			// Si oui, envoie la réponse de Spiderman...
			messagePerso('Les maths.');
		}
		else if (message.includes('test'))
		{
			messagePerso('test');
		} else 
		{
			messagePerso('Un grand pouvoir implique de grandes responsabilitées.');
		}
	}
	
}

function messagePerso(io, message)
{
	io.sockets.emit('new_message',
		{
			name:'Spiderman',
			message:'<span class="spiderman"> ' + message + '</span>',
			avatar:"<img src='/modules/avatar/spiderman.svg' alt='Spiderman avatar' width='30px'>"
		});
}
