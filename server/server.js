// Chargement des dépendances
var express = require('express');	// Framework Express
var http = require('http');		// Serveur HTTP
var ioLib = require('socket.io');	// WebSocket
var ent = require('ent');		// Librairie pour encoder/décoder du HTML
var path = require('path');		// Gestion des chemins d'accès aux fichiers	
var fs = require('fs');			// Accès au système de fichier
require('dotenv').config();

// Chargement des modules perso
var daffy = require('./modules/daffy.js');
var users = require('./modules/users.js');
var messagesHistory = require('./modules/messagesHistory/messagesHistory.js');
var gifs = require('./modules/gifs.js');
var meteo = require('./modules/meteo.js');
var coiffeur = require('./modules/coiffeur.js');
var whisper = require('./modules/whisper.js');
var eastereggs = require('./modules/eastereggs.js');
var commandes = require('./modules/commandes.js');
var basket = require('./modules/basket.js');
var blague = require('./modules/blague.js');
var avatar = require('./modules/avatar.js');
var spiderman = require('./modules/spiderman.js')
var quizz = require('./modules/quizz.js')
var konami = require('./modules/konami.js');
var youtubemusic = require('./modules/music_player.js');
var tenor = require('./modules/tenor.js');
var ratio = require('./modules/ratio.js');
var sondage = require('./modules/sondage.js');
var chatGPT = require('./modules/chatgpt.js');

// Initialisation du serveur HTTP
var app = express();
var server = http.createServer(app);

// Initialisation du websocket
var io = ioLib.listen(server);

app.get('/', function(req, res){
	res.sendFile(path.resolve(__dirname + '/../client/home.html'));
});

// Traitement des requêtes HTTP (une seule route pour l'instant = racine)
app.get('/chat', function(req, res)
{
	res.sendFile(path.resolve(__dirname + '/../client/chat.html'));
});

app.get('/contact', function(req, res){
	res.sendFile(path.resolve(__dirname + '/../client/contact.html'));
});

app.post('/contact', function(req, res){
	// Process
});

// Traitement des fichiers "statiques" situés dans le dossier <assets> qui contient css, js, images...
app.use(express.static(path.resolve(__dirname + '/../client/assets')));

// Initialisation du module Basket
basket.init(io);

// Gestion des connexions au socket
io.sockets.on('connection', function(socket)
{
	// Ajoute le client au jeu de basket
	basket.addClient(socket);

	// Arrivée d'un utilisateur
	socket.on('user_enter', function(name, avatarId)
	{
		// Stocke le nom de l'utilisateur dans l'objet socket
		socket.name = name;
		socket.avatarId = avatarId;

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

		// Transmet le message au module whisper
		let whisp = whisper.handleMessage(io, socket, message, users.users());
		// Si le message est un MP, ne pas poursuivre
		if (whisp)
			return;

		//On traite le message pour savoir si c'est une commande ou non
		message = commandes.handleCommandes(io, message, socket)
		if (message === null)
			return;

		// Transmet le message à tous les utilisateurs (broadcast)
		const newMessage = {
			name:socket.name,
			message:message,
			senderId: socket.id,
			avatar: avatar.getAvatar(socket.avatarId)
		};
		io.sockets.emit('new_message', newMessage);

		// Ajoute le message à l'historique
		messagesHistory.addToHistory(newMessage);
		
		// Transmet le message au module Daffy (on lui passe aussi l'objet "io" pour qu'il puisse envoyer des messages)
		daffy.handleDaffy(io, message);

		// Transmet le message au module Daffy (on lui passe aussi l'objet "io" pour qu'il puisse envoyer des messages)
		sondage.handleSondage(io, message, socket.name);

		// Transmet le message au module EasterEggs (on lui passe aussi l'objet "io" pour qu'il puisse envoyer des messages)
		eastereggs.handleEasterEggs(io, message);

		// Transmet le message au module Basket
		basket.onMessage(io, message);

		//Transmet le message au module Blague
		blague.handleBlague(io, message)

		// Transmet le message au module Météo
		meteo.handleMessage(io, socket, message);

		// Transmet le message au module Coiffeur
		coiffeur.handleCoiffeur(io, socket, message);

		// Transmet le message au module Spiderman
		spiderman.handleSpider(io, message);

		// Transmet le message au module Quizz
		quizz.handleQuizz(io, message);

		// Transmet le message au module Youtube
		youtubemusic.handleMusicYoutube(io, message);

		// Transmet le message au module Tenor
		tenor.handleTenor(io, message);

		// Transmet le message au module ratio
		ratio.handleMessage(io, socket, message);

		// Transmet le message au module ChatGPT
		chatGPT.handleMessage(io, message);

	});

	// Réception du message konami
	socket.on('konami', function()
	{
		// On dit à konami de s'activer
		konami.handleKonami(io);
	});

	// récéption de l'évenement de suppression de l'historique
	socket.on('empty-chat-history', function()
	{
		// suppression de l'historique
		messagesHistory.emptyHistory();
	});

	socket.on("disconnect", function()
	{
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

		gifs.handleGif(search, offset).then(function (res)
		{
			// Transmet le message à l'utilisateur
			io.to(socket.id).emit('results_search_gifs', {gifs:res, offset:offset});
		});

	});

	socket.on('click_response', function(params)
	{
		sondage.resultSondage(io, params.id, params.idSondage);
	});

	// Démarrage de la récupération des gifs trending et renvoi du résultat au client
	socket.on('trending_gifs', function()
	{
		gifs.handleTrendingGif().then(function (res)
		{
			// Transmet le message à l'utilisateur
			io.to(socket.id).emit('results_search_gifs', {gifs:res});
		});

	});
});

// Lance le serveur sur le port 8090 (http://localhost:8090)
server.listen(8090);
