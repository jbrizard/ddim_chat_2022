// Chargement des dépendances
var express = require('express');	// Framework Express
var http = require('http');		// Serveur HTTP
var ioLib = require('socket.io');	// WebSocket
var ent = require('ent');		// Librairie pour encoder/décoder du HTML
var path = require('path');		// Gestion des chemins d'accès aux fichiers	
var fs = require('fs');			// Accès au système de fichier

// Chargement des modules perso
var daffy = require('./modules/daffy.js');
var shifumi = require('./modules/shifumi.js');

// Initialisation du serveur HTTP
var app = express();
var server = http.createServer(app);

// Initialisation du websocket
var io = ioLib.listen(server)

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
	});
	
	// Réception d'un message
	socket.on('message', function(message)
	{
		// Par sécurité, on encode les caractères spéciaux
		message = ent.encode(message);
		
		// Transmet le message à tous les utilisateurs (broadcast)
		io.sockets.emit('new_message', {name:socket.name, message:message});
		
		// Transmet le message aux modules (on passe aussi l'objet "io" pour que les modules puissent envoyer des messages)
		daffy.handleDaffy(io, message);
		shifumi.handleShifumi(io, message, socket);
	});

	// Récéption du joueur choisi lorsque une partie de shifumi est demandée
	socket.on('choosen_player', function(idPlayer){
		
		// Transmet au module shifumi
		shifumi.newGame(io, idPlayer, socket);
	});
	
	// Récéption du choix du joueurs (Pierre, feuille ou ciseaux)
	socket.on('shifumi_choice', function(choice){
		// Transmet au module shifumi
		shifumi.handleChoice(choice, socket);
	});
});

// Lance le serveur sur le port 8080 (http://localhost:8080)
server.listen(8080);