/*
 * Nom : Youtube
 * Description : Ce module fait affiche la vidéo d'une recherche youtuve
 * Auteur(s) : Valentine SALISSON, Kadim ARSLAN 
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
	handleYoutube: handleYoutube // permet d'appeler cette méthode dans server.js -> Youtube.handleYoutube(...)
}

/**
 * Lorsqu'on appelle Youtube, il répond...
 */
function handleYoutube(io, message)
{
	// Récupération du message pour effectuer notre commande 
	message = message.toLowerCase();
	//On récupère ce qu'il y a près notre commande youtube et qui correspond au sujet de recherche
	searchItem=message.split('/youtube ');
	itemSubject=searchItem[1];
  
	// Si notre commande /youtube est effectuée
	if (message.includes('/youtube'))
	{
		//On appelle l'api youtube avec notre clé	
		var YouTube = require('youtube-node');
		var youTube = new YouTube();
		youTube.setKey('AIzaSyAT5zizzUqIxL3o0hYtA7bFOwFIqtb91O4');

		//On ajoute un parametre pour ne sélectionner que des vidéos
		youTube.addParam('type', 'video');

		// On effectue la recherche avec notre sujet
		youTube.search(''+itemSubject+'', 1, function(error, result) 
		{
			if (error){
				console.log(error);
			}
				
			
			// Si non, on récupère l'id de la vidéo
			var videoId= result["items"][0]["id"]["videoId"];
			var videoTitle = result["items"][0]["snippet"]["title"];
			var videoChannel= result["items"][0]["snippet"]["channelTitle"];

			//On affiche la vidéo dans une iframe
			io.sockets.emit('new_message',
			{
				name:'YouTubeBot',
				message:
					'<div class="youtube">'
				+'<p><strong>'+videoChannel+'</strong></p>'
				+'<h3>'+videoTitle+'</h3>'
				+'<iframe width="350" height="180" src="https://www.youtube.com/embed/'+videoId+'"'+'></iframe>'
				+'</div>'
				
			});
		});
			
	}
}
