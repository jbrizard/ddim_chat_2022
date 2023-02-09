// Déclaration de la variable qui contiendra les comptes à rebours
var timeoutHandle ;
socket.on('announce_user', announceUser);
socket.on('user_tiping', userWriting);
socket.on('last_message_viewed', lastMessageViewed);

/**
 * Enleve les noms d'utilisateur et cache le message
 */
function clearUserWriting()
{
    $('#list-user-writing').empty()
    $('#user-writing').hide();
}

/**
 * Affichage d'un message lorsque qu'un nouvel utilisateur arrive
 */
function announceUser(data)
{
    $('#chat #messages').append(
        '<div class="new-user">'
        + 'Nouvelle utilisateur connecté: Bienvenue '
        + data.user
        + '!'
        + '</div>'
    )
        .scrollTop(function(){ return this.scrollHeight });  // scrolle en bas du conteneur

}

/**
 * Affichage du check et du nom de la personne ayant vu le dernier message
 */
 function lastMessageViewed(data)
 {
     $('#message-viewed').css("display", "flex").appendTo(".message:last");
     // data.name devient data.names
     // il faut parcourir le tableau et l'afficher après "vu par..." (voir méthode join()...)
     console.log(data);
     $('#who-viewed').text("vu par " + data.names.join(', '));
 
 }

/**
 * Vérifie si l'utilisateur en cours est en focus sur le chat 
 */
setInterval(checkFocus, 2000);
function checkFocus()
{
    if (document.hasFocus())
    {
        socket.emit('user_has_focus');
    }
}

/**
 * Définit le message
 */
function userWriting(data)
{
    // Reset le compte a rebours avant de cacher le message
    window.clearTimeout(timeoutHandle);
    // Affichage du message
    $('#user-writing').css('display', 'flex');
    // Si le nom n'est pas déjà affiché...
    if (!($('#'+data.user).length > 0)) {
        // Si le message contient déjà des noms d'utilisateurs, disposés un "and" de liaison
        if ($('#list-user-writing').children().length > 0){
            $('#list-user-writing').append(
                '<span '
                +'class="writing-and">'
                +'and'
                +'</span>'
            )
            $('#list-user-writing').append(
                '<span id="' + data.user + '">' +data.user +'</span>'
            )
        }
        // Sinon, afficher simplement le message
        else {
            $('#list-user-writing').append(
                '<span id="' + data.user + '">' + data.user + '</span>'
            )
        }

    }
    // Démarrer un compte à rebours qui cachera le message si pas de nouvelle activité
    timeoutHandle = window.setTimeout(clearUserWriting,1000);
}
