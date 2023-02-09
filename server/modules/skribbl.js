/*
 * Nom : Scribble
 * Description : Ce module est un mini jeu
 * Auteur(s) : Valentine SALISSON, Kadim ARSLAN 
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  
{
	handleSkribblStop : handleSkribblStop,
	handleSkribblAnswer:handleSkribblAnswer,
	handleSkribblStart: handleSkribblStart // permet d'appeler cette méthode dans server.js -> Scribble.handleScribble(...)
}

var randomWord='';
var SkribblTimer= 0;
var jeu=false;
var intervalTimer;

/**
 * Lorsqu'on appelle Scribble, il répond...
 */
function handleSkribblStart(io,socket)
{
	var tableWord=['Shrek','Pikachu','Bouquet de fleurs','Casque','peintre','raisin','crabe','glace','bowling'];
	randomWord = tableWord[Math.floor(Math.random() * tableWord.length)];
	jeu=true;
	
	intervalTimer = setTimeout(function(){
			jeu=false;
			io.sockets.emit('skribbl_inactive_canvas');
			io.sockets.emit('skribbl_timeout',randomWord);
			console.log(randomWord);
	}, 30000);
	

	socket.emit('skribbl_random_word',randomWord);
	io.sockets.emit('skribbl_active_canvas');
}

/**
 * Lorsqu'on met un message dans le tchat, on vérifie si le contenu correspond au dessin
 */
function handleSkribblAnswer(io,message,name)
{
	if(!jeu)
		return;

	//On decode de la même manière le contenu du message et le mot à trouver
	var propal = message.replaceAll('&#233;','e').replaceAll('&#224;','a').replaceAll('&#232;','e').replaceAll('&#226;','').toLowerCase();
	var randy = randomWord.replaceAll('é','e').replaceAll('à','a').replaceAll('è','e').replaceAll('â','a').toLowerCase();

	//Le message contient le mot clé
	if (propal.includes(randy))
	{
		clearTimeout(intervalTimer);//On remet le chrono à 0
		jeu=false; //le jeu est terminé
		io.sockets.emit('skribbl_inactive_canvas');//On demande à désactiver le canvas chez tous les clients
		io.sockets.emit('skribbl_end_game',randomWord,name.name);// On affcihe le nom de la personne ayant trouvé le mot
	}
}

function handleSkribblStop(io){
	clearTimeout(intervalTimer); //On remet le chrono à 0
	jeu=false; //le jeu est terminé
	io.sockets.emit('skribbl_inactive_canvas'); //On demande à désactiver le canvas chez tous les clients
	io.sockets.emit("skribbl_stop_game");
}