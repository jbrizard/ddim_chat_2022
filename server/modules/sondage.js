/*
 * Nom : Sondage
 * Description : Ce module gère les sondages !
 * Auteur(s) : Timothei CHARTIER & Flavien GOUDET
 */

const { response } = require("express");

var nombrePersonne = 0;

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
	handleSondage: handleSondage, // permet d'appeler cette méthode dans server.js -> daffy.handleDaffy(...)
	resultSondage: resultSondage
}

var idResponse = 0;

var idSondage = 0;

let tableauResult = [
	
];

/**
 * Lorsqu'on appelle Daffy, il répond...
 */
function handleSondage(io, message, name)
{
	// Est-ce qu'il contient une demande de sondage
	if (message.includes('/sondage'))
	{		
		var countReplace = 0;
		let regex = /sondage\s(.+)\?(.+)\s\&(.+)/;
		let match = message.match(regex);

		if (!match)
		{
			// Si le sondage est mal écrit, envoie un message d'aide
			  io.sockets.emit('new_message',
			  {
				  name:'Sondage',
				  message:"<p>Votre format de sondage n'est pas conforme. Voici le format à suivre : <b>/sondage</b> Question <b>?</b> Réponse1 <b>&</b> Réponse2</p>"
			  });
			  return;
		}

		var response = [];
		question = match[1];
		response.push(match[2]);
		match[3] = match[3].substring(0,0) + match[3].slice(4);
		response.push(match[3]);

		var sondageVar={
			name: name,
			question: question,
			answerOne: response[0],
			answerTwo: response[1],
			idResponseOne: idResponse++,
			idResponseTwo: idResponse++,
			idSondage: idSondage,
			countResponseOne:0,
			countResponseTwo:0,
			countResponseTotal:0,
			resultResponseOne:0,
			resultResponseTwo:0
		};
		
		// Si oui, envoie le sondage
		io.sockets.emit('new_sondage',sondageVar);

		//On passe dans un tableau les questions, les deux réponses et 3 informations à 0 pour stocker le nombre de réponses total, le nombre de réponses pour la première proposition et le nombre de réponses pour la deuxième proposition
		tableauResult.push(sondageVar);
		
		return idResponse + 2, idSondage++;
	}
}

//Résultat du sondage à envoyer lorsque l'utilisateur vote
function resultSondage(io, id, idSondage)
{
	var sondageVar=tableauResult[idSondage];

	if (id % 2 == 0)
		sondageVar.countResponseOne++;
	else
		sondageVar.countResponseTwo++;

	sondageVar.countResponseTotal++;
	
	sondageVar.resultResponseOne = Math.floor(sondageVar.countResponseOne / sondageVar.countResponseTotal * 100) + '%';
	sondageVar.resultResponseTwo = Math.floor(sondageVar.countResponseTwo / sondageVar.countResponseTotal * 100) + '%';
	
	io.sockets.emit('result_sondage',sondageVar);
	var nombrePersonne = Object.keys(io.sockets.connected).length;
	if(nombrePersonne === sondageVar.countResponseTotal){
		io.sockets.emit('finish_sondage',sondageVar);
	}
}
