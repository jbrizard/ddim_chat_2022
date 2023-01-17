// Connexion au socket
var socket = io.connect(':8090');
let usersList = [];

// Demande un pseudo et envoie l'info au serveur
if (typeof(localStorage.user_name) == 'undefined')
{
	// TODO: Open modal register
}
else {
	name = localStorage.user_name;
	avatar = localStorage.user_avatar;
	socket.emit('user_enter', name);
}

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

// Action quand on appuye sur la touche [Entrée] dans le champ de message (= comme Envoyer)
$('#message-input').keyup(function(evt)
{
	if (evt.keyCode === 13) // 13 = touche Entrée
		sendMessage();
	// 13 = touche Entrée
});

$('#pseudo').keyup(function(evt)
{
	if (evt.keyCode === 13) {
		register();
	} // 13 = touche Entrée
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

function register() {
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

	// add class hidden to modal
	$('#modal').addClass('hidden');

	//envoie pseudo et icone au serveur
	socket.emit('user_enter', pseudoVal, iconeVal);
}

function iconSelected(){
	$('.id-icone').parent().removeClass("icone-selected");
	$('.id-icone:checked').parent().addClass("icone-selected");
}

/**
 * Affichage d'un message reçu par le serveur
 */
function receiveMessage(data)
{
	if(data.avatar === undefined){
		data.avatar = "<img src='/modules/avatar/default.svg' alt='default avatar' width='30px'>";
	}

//TODO: Ajouter data.avatar dans les résultats

	const isCurrentNotExcluded = (!data?.excludedUsers?.includes(socket.id) ?? true); //client courrant n'est pas dans la liste d'exclusion
	if (isCurrentNotExcluded)
	{

		//switch type
		let finalMessageElement = '';
		switch(data.type)
		{
			case 'message': break;
			case 'message': /*To implement; */ break;
			case 'info': finalMessageElement = renderInfoMessage(data); break;
			case 'whisper': finalMessageElement = renderWhisperMessage(data); break;
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

	if (data.message.includes('@'+name))
	{
		var audio = new Audio('sounds/wizz.mp3');
		audio.play();
		$('body').addClass('shaking');
		setTimeout(function()
		{
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


function renderWhisperMessage(data)
{
	const isSender = (typeof(data?.senderId) !== 'undefined' && data.senderId === socket.id);
	const ownerClassName = [];
	ownerClassName.push((isSender) ? 'isSender' : 'isReceiver');

	return (
		`<div class="message ${ownerClassName.join(' ')} whisper-msg">
			<div class="subMessage">
				<span class="user">~ ${data.name}</span>  
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

function getMessagesHistory(messages)
{
	// on vide le html correspondant à la liste des messages
	$('#chat #messages').empty();
	for (const m of messages)
	{
		$('#chat #messages').append(renderMessage(m)).scrollTop(function(){ return this.scrollHeight });  // scrolle en bas du conteneur
	}
}

function generateUserRow(user)
{
	return `
		<div class="userCard">
			<span class='status ${user.status}'></span>
			<span class="name">${user.name}</span> 
		</div>
	`
}
