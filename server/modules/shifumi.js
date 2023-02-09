/*
 * Nom : Shifumi
 * Description : Ce module permet de savoir qui va gagner un café offert à la pause
 * Auteur(s) : Aubin EBANO
 */

const { isSet } = require("util/types");

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
	handleShifumi:handleShifumi, // permet d'appeler cette méthode dans server.js -> shifumi.startgame(...)
	newGame:newGame, // Lance une nouvelle partie de shifumi
	handleChoice:handleChoice //Logique
}

var playerA;
var playerB;


/**
 * Gére le création d'un duo de joueurs
 * Lorsqu'on appelle shifumi
 */
function handleShifumi(io, message, socket)
{
	// Passe le message en minuscules (recherche insensible à la casse)
	message = message.toLowerCase();
	
	// Est-ce qu'il contient un appel à shifumi
	if (message.includes('/shifumi'))
	{	
		// Liste des utilisateurs connectées
		var options;
		for (var socketId in io.sockets.connected)
		{
			var userData = io.sockets.connected[socketId];
			if(userData.id != socket.id)
			{
				options += '<option value="'+ userData.id +'" >' + userData.name + '</option>';
			}
		}

		// On demande à l'utilisateur qui il souhaite affronter
		socket.emit('new_message',
		{
			name:'Shifumi',
			message:'<span>Vous allez lancer une partie de shifumi, qui souhaitez vous affronter ?</span>'
			+'<select name="gamer-choice" id="gamer-choice"> <option value="" selected disabled hidden>Choisir un adversaire</option>'
			+ options +'</select>'
		});
	}
}

/**
 * Démarre une nouvelle partie
 * Lorsqu'on a choisit un adversaire
*/

function newGame(io, playerBId, socket)
{

	// Définit les joueurs A et B
	playerA = socket;
	playerB = io.sockets.connected[playerBId]; 

	// Avertit le joueur B qu'il à été ajouté à une partie
	playerB.emit('new_message', {
		name:'Shifumi',
		message:'<span>Vous avez été ajouté à une partie de Shifumi par '+ playerA.name +'</span>'
	})

	// Affiche 3 inputs (Pierre, Feuille, Ciseaux)
	var shifumiChoices = {
		name: 'Shifumi', 
		message: '<span>Faites un choix : Pierre, Feuille ou Ciseaux ? </br>'
		+'<input type="image" id="pierre" class="shifumi-choices" alt="pierre" value="pierre"  src="/media/shifumi/rock_1faa8.png" width="20px">'
		+'<input type="image" id="feuille" class="shifumi-choices" alt="feuille" value="feuille" src="/media/shifumi/fallen-leaf_1f342.png" width="20px">'
		+'<input type="image" id="ciseaux" class="shifumi-choices" alt="ciseaux" value="ciseaux" src="/media/shifumi/scissors_2702-fe0f.png" width="20px">'
		+'</span>'
	}
	playerA.emit('new_message', shifumiChoices);
	playerB.emit('new_message', shifumiChoices);

	playerA.choice = null;
	playerB.choice = null;
}

/**
 * Traite les choix des joueurs
 * Lorsque un joueur fait un choix 
*/

function handleChoice(choice, socket){

	// Enregistre le choix du joueur
	if (socket == playerA){
		playerA.choice = choice;
	}else{
		playerB.choice = choice;		
	}

	if(playerA.choice != null && playerB.choice != null){
		endGame(playerA.choice, playerB.choice);
	}
}

/**
 * 
 */

function endGame(aChoice, bChoice)
{
	var winner = determineWinner(aChoice, bChoice);

	// Ecrit les messages en fonction du résultat
	if(winner != null){
		var resultMessage = "<span class=\"shifumi_results\"> <strong>" + playerA.name + "</strong> a joué <strong>" + aChoice + "</strong> <br> <strong>" + playerB.name + "</strong> a joué <strong>" + bChoice + "</strong> <br> <strong>" + winner +"</strong> a gagné </span>";
	}else{
		var resultMessage = "<span class=\"shifumi_results\"> <strong>" + playerA.name + "</strong> a joué <strong>" + aChoice + "</strong> <br> <strong>" + playerB.name + "</strong> a joué <strong>" + bChoice + "</strong> <br> c'est une égalité </span>";
	}

	// Envoi les messages dans le chat
	var message = {
		name: 'Shifumi', 
		message: resultMessage
	}
	playerA.emit('new_message', message);
	playerB.emit('new_message', message);
}


/* 
* On compare les scores et détermine qui est le vainceurs
*/

function determineWinner(aChoice, bChoice)
{
	var winner;

	if (aChoice == "pierre"){
		if (bChoice == "feuille"){
			winner = playerB.name;
		}
		else if (bChoice == "ciseaux"){
			winner = playerA.name;
		}
	} else if (aChoice == "feuille"){
		if (bChoice == "pierre"){
			winner = playerA.name;
		}
		else if (bChoice == "ciseaux"){
			winner = playerB.name;
		}
	} else if (aChoice == "ciseaux"){
		if (bChoice == "pierre"){
			winner = playerA.name;
		}
		else if (bChoice == "feuille"){
			winner = playerB.name;
		}
	} else{
		winner = null;
	}

	return winner;
}