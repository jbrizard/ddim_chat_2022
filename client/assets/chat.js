﻿// Connexion au socket
var socket = io.connect(':8090');

// Demande un pseudo et envoie l'info au serveur
var name = prompt('Quel est votre pseudo ?');
socket.emit('user_enter', name);

// Gestion des événements diffusés par le serveur
socket.on('new_message', receiveMessage);
socket.on('notify_user', notifyUser);

// Action quand on clique sur le bouton "Envoyer"
$('#send-message').click(sendMessage);

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

/**
 * Affichage d'un message reçu par le serveur
 */
function receiveMessage(data)
{
	console.dir(data)
	if (!data.excludedUsers?.includes(socket.id) ?? true) {
		$('#chat #messages').append(
			'<div class="message">'
				+ '<span class="user">' + data.name  + '</span> ' 
				+ data.message 
			 + '</div>'
		)
		.scrollTop(function(){ return this.scrollHeight });  // scrolle en bas du conteneur	
	}
}

// différents status de connextion d'un utilisateur
const connectionStatus = {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
}

function notifyUser(data) 
{
	$('#users #user-list').empty();
	for (const userId in data.users) {
		const user = data.users[userId];
		
		if (user.status === connectionStatus.CONNECTED) {
			$('#users #user-list').append(
				`<div class="userCard">
					<span class='statusPill connected'></span>
					<span class="name">${user.name}</span> 
				</div>`
			);
		}	
	}
}