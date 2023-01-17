// Chargement des dépendances
var express = require('express');	// Framework Express
var http = require('http');		// Serveur HTTP
var ioLib = require('socket.io');	// WebSocket
var ent = require('ent');		// Librairie pour encoder/décoder du HTML
var path = require('path');		// Gestion des chemins d'accès aux fichiers	
var fs = require('fs');			// Accès au système de fichier

// Chargement des modules perso
var daffy = require('./modules/daffy.js');
var userInteraction = require('./modules/userInteraction.js');

// Initialisation du serveur HTTP
var app = express();
var server = http.createServer(app);

// Initialisation du websocket
var io = ioLib.listen(server)


// Variable qui stock le dernier utilisateur ayant envoyé un message
var lastMessageUser= null;

// Traitement des requêtes HTTP (une seule route pour l'instant = racine)
app.get('/', function(req, res)
{
	res.sendFile(path.resolve(__dirname + '/../client/chat.html'));
});
  
// Traitement des fichiers "statiques" situés dans le dossier <assets> qui contient css, js, images...
app.use(express.static(path.resolve(__dirname + '/../client/assets')));

// Gestion des connexions au socket
io.sockets.on('connection', function(socket)
{
	// Arrivée d'un utilisateur
	socket.on('user_enter', function(name)
	{
		// Stocke le nom de l'utilisateur dans l'objet socket
		socket.name = name;

		// Transmet le message au module UserInteraction (on lui passe aussi l'objet "io" pour qu'il puisse envoyer des messages)
		userInteraction.announceUser(socket, name);
	});

    // Transmet le statut du message au module UserInteraction (on lui passe aussi l'objet "io" pour qu'il puisse envoyer des messages)
    
	
	// Réception d'un message
	socket.on('message', function(message)
	{
		// Par sécurité, on encode les caractères spéciaux
		message = ent.encode(message);
		
		// Transmet le message à tous les utilisateurs (broadcast)
		io.sockets.emit('new_message', {name:socket.name, message:message});
		
		// Transmet le message au module Daffy (on lui passe aussi l'objet "io" pour qu'il puisse envoyer des messages)
		daffy.handleDaffy(io, message);

		// Enregistre le dernier utilisateur ayant envoyé un message
		lastMessageUser = socket;
	});
	

	// Réception d'un focus
	socket.on('user_has_focus', function()
	{
		// Vérifie si un autre utilisateur (différent du dernier utlisateur) est en focus sur le chat
		if (lastMessageUser != socket && lastMessageUser != null)
		{
			// Informe les autres utilisateurs (sauf celui qui a le focus ) que le dernier message a été vu
			socket.broadcast.emit('last_message_viewed', {name:socket.name});
		}
	})
});

// Lance le serveur sur le port 8080 (http://localhost:8080)
server.listen(8080);