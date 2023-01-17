﻿// Connexion au socket
var socket = io.connect(':8090');
let usersList = [];

if (typeof(localStorage.user_name) == 'undefined')
{
	// Demande un pseudo et envoie l'info au serveur
	var name = prompt('Quel est votre pseudo ?');

	if (confirm('Voulez-vous enregistrer votre pseudo ?'))
	{
		localStorage.user_name = name;
	}
}
else
{
	name = localStorage.user_name;
}

socket.emit('user_enter', localStorage.user_name);

// Gestion des événements diffusés par le serveur
socket.on('new_message', receiveMessage);
socket.on('notify_user', notifyUser);
socket.on('get_messages_history', getMessagesHistory);

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

// Action quand on clique sur le 'Supprimer historique du chat'
$('#empty-chat-action').click(emptyChatHistory);

/**
 * Sauvegarde un message dans le localstorage
 */
function hydrateLocalHistory(message) {
	if (typeof(localStorage.history) === 'undefined') {
		localStorage.history = JSON.stringify([]);
	}

	const history = JSON.parse(localStorage.history);
	history.push(message);
	localStorage.history = JSON.stringify(history);
}

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
	hydrateLocalHistory(message);
}

/**
 * Affichage d'un message reçu par le serveur
 */
function receiveMessage(data)
{	
	const isCurrentNotExcluded = (!data?.excludedUsers?.includes(socket.id) ?? true); //client courrant n'est pas dans la liste d'exclusion
	if (isCurrentNotExcluded) {

		//switch type
		let finalMessageElement = '';
		switch(data.type) {
			case 'message': /*To implement; */ break;
			case 'info': finalMessageElement = renderInfoMessage(data); break;
			default: finalMessageElement = renderMessage(data); break;
		}

		$('#chat #messages').append(finalMessageElement).scrollTop(function(){ return this.scrollHeight });  // scrolle en bas du conteneur	
	}
}

/**
 * Génère le HTML d'un message
 */
function renderMessage(data)
{
	const isSender = (typeof(data?.senderId) !== 'undefined' && data.senderId === socket.id);
	const ownerClassName = [];
	ownerClassName.push((isSender) ? 'isSender' : 'isReceiver');
	if(data.message.includes('@'+name))
	{
		var audio = new Audio('sounds/wizz.mp3');
		audio.play();
		$('body').addClass('shaking');
		setTimeout(function(){
			$('body').removeClass('shaking');
		},1600);
	}
	data.message = data.message.replace('@'+name,"<span class='ping'>@"+name+"</span>");
	return (
		`<div class="message ${ownerClassName.join(' ')}">
			<div class="subMessage">
				<span class="user"> ${data.name}</span>  
				<span class="text">${data.message}</span>			
			</div>
		</div>`
	);
}

/**
 * Génère le HTML d'un message informatif
 */
 function renderInfoMessage(data)
 {
	return (
	`<div class="message info">
		<div class="subMessage">
		${data.message}			
		</div>
	</div>`
	);
 }

// différents status de connextion d'un utilisateur
const connectionStatus = {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
}

function notifyUser(data) 
{
	// on vide le html correspondant à la liste d'utilisateurs
	$('#users #user-list').empty();
	usersList = [];

	// on parcours tous les utilisateurs
	for (const userId in data.users) 
	{
		// on ajoute la carte HTML de chaque utilisateur dans le DOM
		const user = data.users[userId];
		if (user.status === connectionStatus.CONNECTED) {
			usersList.push(user);
			$('#users #user-list').append(generateUserRow(user));
		}	
	}
}

/**
 * Cette méthode vide la liste HTML des messages du chat et réinjecte les messages passer en paramètre
 * @param {*} messages 
 */
function getMessagesHistory(messages) 
{
	// on vide le html correspondant à la liste des messages
	$('#chat #messages').empty();
	for (const m of messages) {
		$('#chat #messages').append(renderMessage(m)).scrollTop(function(){ return this.scrollHeight });  // scrolle en bas du conteneur	
	}
}

/**
 * Cette méthode génère le HTML représentant un utilisateur dans la liste d'utilisateur
 */
function generateUserRow(user) 
{
	return `
		<div class="userCard">
			<span class='status ${user.status}'></span>
			<span class="name">${user.name}</span> 
		</div>
	`
}

/**
 * Cette méthode est appelée lors du click sur 'Vider l'historique
 */
function emptyChatHistory() 
{
	// on vide le html correspondant à la liste des messages
	$('#chat #messages').empty();
	socket.emit('empty-chat-history', localStorage.user_name);
}