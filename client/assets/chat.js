// Connexion au socket
var socket = io.connect(':8090');

// Demande un pseudo et envoie l'info au serveur
var name = prompt('Quel est votre pseudo ?');
socket.emit('user_enter', name);

// Gestion des événements diffusés par le serveur
socket.on('new_message', receiveMessage);

// Action quand on clique sur le bouton "Envoyer"
$('#send-message').click(sendMessage);

// Action quand on appuye sur la touche [Entrée] dans le champ de message (= comme Envoyer)
$('#message-input').keyup(function(evt)
{
	//L'utilisateur est en train d'écrire
	socket.emit('new_user_tiping', name);

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
	if ($("#upload")[0].files[0])
	{
		sendFile ()
	}
	// On n'envoie pas un message vide
	if (message == '')
		return;
	
	// Envoi le message au serveur pour broadcast
	socket.emit('message', message);
	$('#message-viewed').hide();

}

/**
 * Affichage d'un message reçu par le serveur
 */
function receiveMessage(data)
{
	clearUserWriting()
	$('#chat #messages').append(
		'<div class="message">'
			+ '<span class="user">' + data.name  + '</span> ' 
			+ data.message 
	     + '</div>'
	);

	$('#chat #messages').scrollTop(function(){ return this.scrollHeight });  // scrolle en bas du conteneur
}
