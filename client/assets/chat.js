﻿// Connexion au socket
var socket = io.connect(':8090');

// Demande un pseudo et envoie l'info au serveur
//var name = prompt('Quel est votre pseudo ?');
//socket.emit('user_enter', name, 2);

// Gestion des événements diffusés par le serveur
socket.on('new_message', receiveMessage);

// Action quand on clique sur le bouton "Envoyer"
$('#send-message').click(sendMessage);

// Action quand on clcique sur le bouton "inscription"
$('#register').click(register);

// Action quand on appuye sur la touche [Entrée] dans le champ de message (= comme Envoyer)
$('#message-input').keyup(function(evt)
{
	if (evt.keyCode == 13) // 13 = touche Entrée
		sendMessage();
});

// Action quand on clique sur le bouton Aide (?)
$('#help-toggle').click(function()
{
        $('#help-content').fadeToggle('fast');
});


/**
 * Envoi d'un message au serveur
 */
function sendMessage()
{
	// Récupère le message, puis vide le champ texte
	var input = $('#message-input');
	var message = input.val();	
	input.val('');
	
	// On n'envoie pas un message vide
	if (message == '')
		return;
	
	// Envoi le message au serveur pour broadcast
	socket.emit('message', message);
}

function register()
{
	// add class hidden to modal
	$('#modal').addClass('hidden');

	socket.emit('user_enter', "OK", 2);
}

/**
 * Affichage d'un message reçu par le serveur
 */
function receiveMessage(data)
{
	$('#chat #messages').append(
	 	'<div class="message">'
		+  data.avatar
		+ '<span class="user">' + data.name +  '</span> '
		+ data.message
		+ '</div>'
	)
	.scrollTop(function(){ return this.scrollHeight });  // scrolle en bas du conteneur
}
