/*
 * Nom : Blague !
 * Description : Ce module fait des blagues
 * Auteur(s) : Jérémie Brizard
 */

const axios = require('axios');
// Définit les méthodes "publiques" (utilisation à l'extérieur du module)const axios = require('axios');
module.exports =  {
	handleBlague: handleBlague
}

/**
 * Lorsqu'on appelle MP, il répond...
 */
function handleBlague(io, message) {
	// Passe le message en minuscules (recherche insensible à la casse)
	message = message.toLowerCase();

	if (message === '/blague') {
		// Utilise l'API pour récupérer une blague aléatoire en français
		axios.get('https://v2.jokeapi.dev/joke/Any?lang=fr')
		  .then(response => {
			  // Envoie la blague au client
              console.log(response.data);
              console.log(response.data.setup);
			  let joke = response.data.setup ? `${response.data.setup} ${response.data.delivery}` : response.data.joke;
			  io.sockets.emit('new_message', {
				  name: 'Poti Blagueur',
				  message: joke
			  });
              
            // Transmet le message à tous les utilisateurs (broadcast)
            io.sockets.emit('new_emote_wall');
              
		  })
		  .catch(error => {
			  // Envoie un message d'erreur au client
			  io.sockets.emit('new_message', {
				  name: 'Poti Blagueur',
				  message: 'Quelle est la différence entre un noir et un arbre ?<br>Un arbre ne tombe pas quand on lui met une corde au cou.'
			  });
		  });
	}
}