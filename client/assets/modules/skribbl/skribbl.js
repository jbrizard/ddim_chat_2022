var canvas;
var ctx;
var color;

// Action quand on clique sur le bouton Skribbl
$('#start-skribbl').click(startGame);

/**
 * Envoi d'un message au serveur pour démarrer le jeu
 */
function startGame()
{
	//On affiche un bouton pour arrêter le jeu
    $("#stop-skribbl").css("display", "block");
    
    //on demande au serveur de démarrer le jeu
    socket.emit('skribbl_start');
    
    //On fait afficher la zone pour le client ayant cliqué sur le bouton
    $("canvas").css("display", "block");
    $('#start-skribbl').css('display','none');
    $('#skribbl_colors').css('display','flex');
    $('#skribbl_bin').css('display','block');

    //On crée le canvas
    canvas = document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    let coord = { x: 0, y: 0 };

    //On crée un évènement au changement de couleur de l'input
    jQuery('#skribbl_choice_color').on('change',function()
    {
      color= $(this).val();
    });

    //Ecouteurs d'évènements
    document.addEventListener("mousedown", start);
    document.addEventListener("mouseup", stop);
    window.addEventListener("resize", resize);
    
    //On définit la zone de dessin
    resize();

    function resize() 
    {
        ctx.canvas.width = 800;
        ctx.canvas.height = 400;
    }

    function start(event) 
    {
        document.addEventListener("mousemove", draw);
        coord.x = event.clientX - canvas.offsetLeft;
        coord.y = event.clientY - canvas.offsetTop;
    }

    function stop() 
    {
        document.removeEventListener("mousemove", draw);
    }

    //fonction pour commencer à dessiner
    function draw(event)
    {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;

        // début du tracé = position précédente de la souris
        skribblMove = { x: coord.x, y: coord.y };

        // modifie les coordonnées pour aller au point actuel de la souris (clientX/clientY)
        coord.x = event.clientX - canvas.offsetLeft;
        coord.y = event.clientY - canvas.offsetTop;

        // fin du tracé = position actuelle de la souris
        skribblLine = { x: coord.x, y: coord.y };

        // fait le tracé avec les coordonnées définies ci dessus
        ctx.moveTo(skribblMove.x, skribblMove.y);
        ctx.lineTo(skribblLine.x, skribblLine.y);        
        ctx.stroke();
        
        //envoie au serveur la position de la souris 
        socket.emit("skribbl_draw",skribblMove,skribblLine,ctx.strokeStyle,color);
    }
}

//Réponse du mot aléatoire à faire deviner
socket.on("skribbl_random_word",show_skribbl);

//Affichage du mot aléatoire à faire deviner
function show_skribbl(randomWord)
{
    $('.skribbl_word_box').css('display','block');
    $('#skribbl_word').html(randomWord);
    
}

//Le serveur demande à tous les clients d'afficher le canvas
socket.on('skribbl_active_canvas',enableCanva)

//fonction qui affiche le canvas
function enableCanva(skribbl_move,skribbl_line)
{
    //On affiche la zone de canvas
    $("canvas").css("display", "block");

    //On cache le bouton jouer pour tous le monde
    $('#start-skribbl').css('display','none');

    //On crée le canvas
    canvas = document.getElementById("canvas");
    ctx=canvas.getContext("2d");

    let coord = { x: 0, y: 0 };
    
    //Ecouteurs d'évènements
    window.addEventListener("resize", resize);
    
    //On définit la zone de dessin
    resize();
    function resize() {
      ctx.canvas.width = 650;
      ctx.canvas.height = 400;
    }
}

//Réception du serveur pour démarrer le dessin chez les clients
socket.on('skribbl_draw_canvas',drawCanvas);

//Dessin écran client
function drawCanvas(skribblMove, skribblLine,color)
{ 
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(skribblMove.x,skribblMove.y);
    ctx.lineTo(skribblLine.x,skribblLine.y);
    ctx.stroke();
}

//si le client appuie sur la poubelle, on demande au serveur d'effacer tous les tracés
$('#skribbl_bin').click(sendEraseCanvas);

//Fonction qui demande au serveur d'effacer les tracés
function sendEraseCanvas()
{
    socket.emit("send_erase_canvas");
}

//On supprimer les tracés pour tous les clients
socket.on('erase_drawings',eraseCanvas);

//On efface les tracés
function eraseCanvas()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//On supprimer les tracés pour tous les clients
socket.on('skribbl_inactive_canvas',supressCanvas);

// On supprime le canva et on arrête le jeu 
function supressCanvas()
{
    //On supprime les tracés du canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //On fait disparaître le canvas
    $("canvas").css("display", "none");
    $("#skribbl_colors").css("display", "none"); //Outils de dessin
}

// On affiche l'arrêt du jeu
socket.on('skribbl_end_game',showEndGame);

function showEndGame(randomWord,name)
{
    $(".end_game").css("display", "flex");  // Affichage popup "Jeu terminé"
    $("#stop-skribbl").css("display", "none"); // Cache du bouton 'Stopper le jeu'
    $('.end_game').append('<p class="skribbl_randomword">Le mot à trouver était "<strong>' + randomWord + '"</strong</p>');
    $('.name').append(name); //Affichage personne gagnante
}

//Le temps de dessin pour deviner est écoulé
socket.on('skribbl_timeout',showTimeOut);

//On affiche la popup du temps écoulé
function showTimeOut(randomWord)
{
    $(".timeout").css("display", "flex");  // Affichage popup temps écoulé
    $('.timeout').append('<p class="skribbl_randomword">Le mot à trouver était <strong>" ' + randomWord + ' "</strong></p>'); 
    $("#stop-skribbl").css("display", "none"); // Cache du bouton arrêter
}

//On demande au serveur de fermer les popups au click sur la croix
$('.suppr').click(closeGame);

//On envoie la requête au serveur
function closeGame()
{
    socket.emit("skribbl_close_game");
}

//Récupération de la réponse du serveur
socket.on('skribble_close_window',supressWindow);

// On ferme la fenêtre 
function supressWindow()
{
    $(".timeout").css("display", "none"); // Popup temps écoulé
    $(".end_game").css("display", "none"); // Popup jeu terminé
    $('.skribbl_word_box').css('display','none'); // Affichage du mot
    $('#start-skribbl').css('display','block'); // Affichage du bouton 'Jouer'
    $('.skribbl_randomword').remove(); //Affichage du mot à faire deviner
    $('.name').empty(); // Nom de la personne ayant trouvé le mot
}

//A l'appui sur le bouton, on demande au serveur d'arrêter le jeu
$('#stop-skribbl').click(sendStopGame);

//On envoie la requête au serveur
function sendStopGame()
{
    socket.emit("skribbl_send_stop_game");
}

//Réception du message du serveur 
socket.on('skribbl_stop_game',stopGame);

// On arrête le jeu
function stopGame()
{
    $('.skribbl_word_box').css('display','none'); // Affichage du mot
    $('#start-skribbl').css('display','block'); // Affichage du bouton 'Jouer'
    $('.skribbl_word_box').css('display','none'); //Affichage du mot à faire deviner
    $('#stop-skribbl').css('display','none'); //Affichage du bouton "stopper le jeu"
}