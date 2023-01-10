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