// Connexion au socket
var socket = io.connect(':8090');
let usersList = [];
let currentUserName = "";

let avatarPerso = null;

// Gestion des événements diffusés par le serveur
socket.on('new_message', receiveMessage);
socket.on('notify_user', notifyUser);
socket.on('get_messages_history', getMessagesHistory);

// Gestion des événements diffusés par le serveur
socket.on('new_emote_wall', () =>
{
	const emoteList = [];
	const nbEmotes = Math.random() * 100;

	for (let i = 0; i < nbEmotes; i++)
	{
		const startTop = document.body.clientHeight;
		const startLeft = Math.random() * document.body.clientWidth;
		const emoteUrlNumber = Math.ceil(Math.random() * 3);
		const emote = `
			<img 
				src="./modules/blague/emoji_${emoteUrlNumber}.png" 
				alt="emote" 
				width="100" 
				height="100"
				class="emote-wall-unit"
				style="
					position: fixed;
					top: ${startTop}px;
					left: ${startLeft}px;
					opacity: 1;
					transition: transform 5s linear,
								opacity 5s linear;
				"
			/>
		`;
		emoteList.push(emote);
	}

	const body = $('body');
	for (const emote of emoteList)
	{
		body.append(emote);
	}

	const emoteListElements = Array.from(document.querySelectorAll('.emote-wall-unit'));
	for (const emote of emoteListElements)
	{
		const endLeft = Math.random() * document.body.clientWidth;
		const endTop = Math.random() * document.body.clientHeight * 2;
		emote.style.transform = `translate(-${endLeft}px, -${endTop}px)`;
		emote.style.opacity = '0';

		setTimeout(() =>
		{
			$(emote).remove();
		}, 5000);
	}
});

// Action quand on clique sur le bouton "Envoyer"
$('#send-message').click(sendMessage);

// Action quand on clcique sur le bouton "inscription"
$('#register').click(register);

// Action quand le button radio change de valeur
$('.id-icone').change(iconSelected);

$('#upload-avatar').change(previewFile);

// Action quand on appuye sur la touche [Entrée] dans le champ de message (= comme Envoyer)
$('#message-input').keyup(function(evt)
{
	//L'utilisateur est en train d'écrire
	socket.emit('new_user_tiping', currentUserName);

	if (evt.keyCode == 13) // 13 = touche Entrée
		sendMessage();

});

$('#pseudo').keyup(function(evt)
{
	if (evt.keyCode === 13)
		register();
});

// Action quand on clique sur le bouton Aide (?)
$('#help-toggle').click(function()
{
        $('#help-content').fadeToggle('fast');
});

// Action quand on clique sur le 'Supprimer historique du chat'
$('#empty-chat-action').click(emptyChatHistory);

/**
 * Sauvegarde un message dans le sessionstorage
 */
function hydrateLocalHistory(message) {
	if (typeof(sessionStorage.history) === 'undefined') {
		sessionStorage.history = JSON.stringify([]);
	}

	const history = JSON.parse(sessionStorage.history);
	history.push(message);
	sessionStorage.history = JSON.stringify(history);
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
	if ($("#upload")[0].files[0])
	{
		sendFile ()
	}
	// On n'envoie pas un message vide
	if (message == '')
		return;
	
	// Envoi le message au serveur pour broadcast
	socket.emit('message', message);
	hydrateLocalHistory(message);
	$('#message-viewed').hide();

}

function register()
{
	//récupère le pseudo
	var pseudoInput = $('#pseudo');
	var pseudoVal = pseudoInput.val();
	//Pas d'envoie si pas de pseudo
	if (pseudoVal == '')
		return;
	//récupère icone
	var iconeVal = 0;

	iconeVal = $('.id-icone:checked').val();

	//Pas d'envoie si pas d'icone
	if (iconeVal === 0)
		return;

	if(avatarPerso != null)
	{
		iconeVal = avatarPerso;
	}

	// add class hidden to modal
	$('#modal').addClass('hidden');

	// Stocke le pseudo dans une variable globale
	currentUserName = pseudoVal;

	//envoie pseudo et icone au serveur
	socket.emit('user_enter', pseudoVal, iconeVal);
}

function iconSelected()
{
	$('.id-icone').parent().removeClass("icone-selected");
	$('.id-icone:checked').parent().addClass("icone-selected");
}

function previewFile()
{
	const preview = document.getElementById('avatar-preview');
	const file = document.getElementById('upload-avatar').files[0];
	const reader = new FileReader();

	reader.addEventListener("load", () =>
	{
		// on convertit l'image en une chaîne de caractères base64
		preview.src = reader.result;
		avatarPerso = reader.result;
	}, false);

	if (file)
	{
		reader.readAsDataURL(file);
	}
}


/**
 * Affichage d'un message reçu par le serveur
 */
function receiveMessage(data)
{
	clearUserWriting()

	if(data.avatar === undefined){
		data.avatar = "<img src='/modules/avatar/default.svg' alt='default avatar' width='30px'>";
	}

	const isCurrentNotExcluded = (!data?.excludedUsers?.includes(socket.id) ?? true); //client courrant n'est pas dans la liste d'exclusion
	if (isCurrentNotExcluded)
	{
		// Changement du rendu en fonction du type de message
		let messageElement = '';
		switch(data.type)
		{
			case 'message': break;
			case 'info': messageElement = renderInfoMessage(data); break;
			case 'whisper': messageElement = renderWhisperMessage(data); break;
			default: messageElement = renderMessage(data); break;
		}

		$('#chat #messages').append(messageElement).scrollTop(function(){ return this.scrollHeight });  // scrolle en bas du conteneur
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

	if (data.message.includes('@'+currentUserName))
	{
		var audio = new Audio('sounds/wizz.mp3');
		audio.play();
		$('body').addClass('shaking');
		setTimeout(function()
		{
			$('body').removeClass('shaking');
		},1600);
	}

	data.message = data.message.replace('@'+currentUserName,"<span class='ping'>@"+currentUserName+"</span>");

	return (
		`<div class="message ${ownerClassName.join(' ')}">
			<div class="subMessage">
				<span class="user">${data.avatar} ${data.name}</span>  
				<span class="text">${data.message}</span>			
			</div>
		</div>`
	);
}

function renderWhisperMessage(data)
{
	const isSender = (typeof(data?.senderId) !== 'undefined' && data.senderId === socket.id);
	const ownerClassName = [];
	ownerClassName.push((isSender) ? 'isSender' : 'isReceiver');

	return (
		`<div class="message ${ownerClassName.join(' ')} whisper-msg">
			<div class="subMessage">
				<span class="user">~ ${data.avatar} ${data.name}</span>  
				<span class="text"><em>${data.message}</em></span>			
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
		if (user.status === connectionStatus.CONNECTED)
		{
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
	for (const m of messages)
	{
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
