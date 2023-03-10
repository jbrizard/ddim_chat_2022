/*
 * Nom : Spiderman !
 * Description : Ce module participe au chat
 * Auteur(s) : Clem-Enzo
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
const { setMaxListeners } = require("events");
const avatar = require("./avatar");
module.exports =  {
	handleSpider: handleSpider // permet d'appeler cette méthode dans server.js -> spiderman.handleSpiderman(...)
}

/*
 * Lorsqu'on appelle Spiderman, il répond...
 */
function handleSpider(io, message)
{
	// Passe le message en minuscules (recherche insensible à la casse)
	message = message.toLowerCase();
	
	// Est-ce qu'il contient une référence à Spiderman ?
	if (message.includes('spiderman') || io.sockets.spiderman === true)
	{
		io.sockets.spiderman = true;
		if (message.includes('calcul'))
		{
			// Si oui, envoie la réponse de Spiderman...
			messagePerso(io,"2+2=4, c'est tout ce que je sais.");
		}
		else if (message.includes('vol'))
		{
			messagePerso(io,'Je suis une araignée pas un pigeon !');
		} 
		else if (message.includes('salut'))
		{
			messagePerso(io,'Salut, ça va ?');
		} 
		else if (message.includes('quitte'))
		{
			messagePerso(io,'Bye !');
			io.sockets.spiderman = false;
		}
		else 
		{
			messagePerso(io,'Un grand pouvoir implique de grandes responsabilitées.');
		}
	}
	
}

//Bloc de message de Spiderman
function messagePerso(io, message)
{
	io.sockets.emit('new_message',
		{
			name:'Spiderman',
			message:'<span class="spiderman"> ' + message + '</span>',
			avatar:"<img src='/modules/avatar/spiderman.svg' alt='Spiderman avatar' width='30px'>"
		});
}
