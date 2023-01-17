// Gestion des sondages
socket.on('new_sondage', receiveSondage);

// Résultat des sondages
socket.on('result_sondage', resultSondage);

socket.on('finish_sondage', finishSondage);

// Action quand on clique sur le bouton "Envoyer"
$(document).on('click','.button-sondage', sendResponse);

/**
 * Affichage d'un sondage reçu par le serveur
 */
function receiveSondage(data)
{
	$('#espace-sondage').css("display", "block");
	$('#espace-sondage').append(
		'<div class="sondage" id="'+ data.idSondage +'">'
			+ '<p>Sondage proposé par : ' + data.name   + '</p> '
			+ '<p>Question : ' + data.question   + '</p> '
			+ '<div class="btn-response">'
			    + '<button data-id="'+ data.idResponseOne +'" id="'+ data.idResponseOne +'" class="button-sondage">'+ data.answerOne +'</button>'
			    + '<button data-id="'+ data.idResponseTwo +'" id="'+ data.idResponseTwo +'" class="button-sondage">'+ data.answerTwo +'</button>'
			+ '</div>'
            + '<div class="response">'
                + '<p id="response-one">'+ data.answerOne +' :</p>'
                + '<p id="number-one">0</p>'
                + '<p id="response-two">| '+ data.answerTwo +' :</p>'
                + '<p id="number-two">0</p>'
            + '</div>'
	     + '</div>'
	)
	$("#conseil-sondage").empty()
	.scrollTop(function(){ return this.scrollHeight });  // scrolle en bas du conteneur
}

//Envoie de la réponse du sondage
function sendResponse()
{
	var id = $(this).data("id");
	var idSondage = $(this).parent().parent().attr('id');
	
	$(this).prop("disabled", true);
	$(this).siblings().prop("disabled", true);

	// Envoi le message au serveur pour broadcast
	socket.emit('click_response', {id:id, idSondage:idSondage});
}

function resultSondage(data)
{	
	$('#number-one').empty();
    $('#number-two').empty();
    $('#number-one').append(data.resultResponseOne);
    $('#number-two').append(data.resultResponseTwo);
}

function finishSondage(data)
{	
	$('#'+data.idSondage).css("display", "none");
	$('#espace-sondage').css("display", "none");
	
	$('#chat #messages').append(
		'<div class="message">'
			+ '<span class="user">Résultat sondage</span> ' 
			+ '<p>Question:'+ data.question +'<p>'
			+ '<p>Réponse:'+ data.answerOne +' = ' + data.resultResponseOne + '<p>'
			+ '<p>Réponse:'+ data.answerTwo +' = ' + data.resultResponseTwo + '<p>'
	     + '</div>' 
	)
	.scrollTop(function(){ return this.scrollHeight });
}

