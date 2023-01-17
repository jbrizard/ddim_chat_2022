// Chargement des dépendances
var express = require('express');	// Framework Express
var http = require('http');		// Serveur HTTP
var ioLib = require('socket.io');	// WebSocket
var ent = require('ent');		// Librairie pour encoder/décoder du HTML
var path = require('path');		// Gestion des chemins d'accès aux fichiers	
var fs = require('fs');			// Accès au système de fichier

// Chargement des modules perso
var daffy = require('./modules/daffy.js');
var users = require('./modules/users.js');
var messagesHistory = require('./modules/messagesHistory/messagesHistory.js');
var gifs = require('./modules/gifs.js');
var meteo = require('./modules/meteo.js');
var coiffeur = require('./modules/coiffeur.js');

// Initialisation du serveur HTTP
var app = express();
var server = http.createServer(app);

// Initialisation du websocket
var io = ioLib.listen(server);

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

		// Ajoute un nouvel utilisateur
		users.connectUser(socket);
		users.notifyUser(io, socket, users.connectionStatus.CONNECTED);

		//Appelle l'historique des messages
		messagesHistory.getAllMessages(io.sockets);
	});

	// Réception d'un message
	socket.on('message', function(message)
	{
		// Par sécurité, on encode les caractères spéciaux
		message = ent.encode(message);

		// Transmet le message à tous les utilisateurs (broadcast)
		const newMessage = {name:socket.name, message:message, senderId: socket.id};
		io.sockets.emit('new_message', newMessage);

		// Ajoute le message à l'historique
		messagesHistory.addToHistory(newMessage);
		
		// Transmet le message au module Daffy (on lui passe aussi l'objet "io" pour qu'il puisse envoyer des messages)
		daffy.handleDaffy(io, message);

		// Transmet le message au module Météo
		meteo.handleMessage(io, socket, message);

		// Transmet le message au module Coiffeur
		coiffeur.handleCoiffeur(io, socket, message);

	});

	socket.on("disconnect", function() {
		users.disconnectUser(socket);
		users.notifyUser(io, socket, users.connectionStatus.DISCONNECTED);
	});


// Réception d'un gif
	socket.on('gif', function(url)
	{
		// Par sécurité, on encode les caractères spéciaux
		url = ent.encode(url);

		// Transmet le gif à tous les utilisateurs (broadcast)
		gifs.handleGifMessage(io, socket, url)
	});

	// Démarrage du recherche de gif et renvoi du résultat au client
	socket.on('search_gifs', function(search, offset = 0)
	{
		// Par sécurité, on encode les caractères spéciaux
		search = ent.encode(search);

		gifs.handleGif(search, offset).then(function (res) {
			// Transmet le message à l'utilisateur
			io.to(socket.id).emit('results_search_gifs', {gifs:res, offset:offset});
		});

	});

	// Démarrage de la récupération des gifs trending et renvoi du résultat au client
	socket.on('trending_gifs', function()
	{
		gifs.handleTrendingGif().then(function (res) {
			// Transmet le message à l'utilisateur
			io.to(socket.id).emit('results_search_gifs', {gifs:res});
		});

	});
});

// Lance le serveur sur le port 8080 (http://localhost:8080)
server.listen(8090);
