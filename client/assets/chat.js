// Connexion au socket
var socket = io.connect(':8090');

// Demande un pseudo et envoie l'info au serveur
var name = prompt('Quel est votre pseudo ?');
socket.emit('user_enter', name);

// Gestion des événements diffusés par le serveur
socket.on('new_message', receiveMessage);

// Gestion des événements diffusés par le serveur
socket.on('new_emote_wall', () => {
	const emoteList = [];
	const nbEmotes = Math.random() * 200;

	for (let i = 0; i < nbEmotes; i++) {
		const startTop = document.body.clientHeight;
		const startLeft = Math.random() * document.body.clientWidth;
		const emote = `
			<img 
				src="./modules/blague/emoji_rire.png" 
				alt="emote_rire" 
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
	for (const emote of emoteList) {
		body.append(emote);
	}

	const emoteListElements = Array.from(document.querySelectorAll('.emote-wall-unit'));
	console.dir(emoteListElements)
	for (const emote of emoteListElements) {
		const endLeft = Math.random() * document.body.clientWidth;
		const endTop = Math.random() * document.body.clientHeight * 2;
		emote.style.transform = `translate(-${endLeft}px, -${endTop}px)`;
		emote.style.opacity = '0';

		setTimeout(() => {
			$(emote).remove();
		}, 5000);
	}
});

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
	$('#chat #messages').append(
		'<div class="message">'
			+ '<span class="user">' + data.name  + '</span> ' 
			+ data.message 
	     + '</div>'
	)
	.scrollTop(function(){ return this.scrollHeight });  // scrolle en bas du conteneur
}
