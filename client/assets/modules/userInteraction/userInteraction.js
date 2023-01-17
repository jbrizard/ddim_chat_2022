socket.on('announce_user', announceUser);
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
 * Vérifie si l'utilisateur en cours est en focus sur le chat 
 */
setInterval(checkFocus, 2000);
function checkFocus(){
    if (document.hasFocus()) {
        socket.emit('user_has_focus');
    }
}
