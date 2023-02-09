// A chaque encoie de fichier
socket.on('new_file', function (data){

    receiveFile(data.link, data.user)
});
/**
 * Ajoute la preview du fichier
 */
function newUploadedFile (input)
{
    // On récupère l'extension du fichier
    var ext = input.files[0]['name'].substring(input.files[0]['name'].lastIndexOf('.') + 1).toLowerCase();
    // On ajoute le nom du fichier dans la preview
    $('#file-name').text(input.files[0]['name']);
    // Si le fichier est une image
    if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg"))
    {
        // On charge l'image et on l'ajoute dans une balise img
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#upload-file').css('display', 'flex');
            $('#upload-preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    } else {
        // On ajoute une image d'illustration
        $('#upload-file').css('display', 'flex');
        $('#upload-preview').attr('src', 'https://images.freeimages.com/fic/images/icons/2813/flat_jewels/512/file.png?ref=findicons');
    }


}
/**
 * On supprime la preview
 */
function deleteFile ()
{
    $("#upload")[0].value = "";
    $('#upload-file').hide();
}
/**
 * On envoie du fichier
 */
function sendFile ()
{

    socket.emit('file',$("#upload")[0].files[0], $("#upload")[0].files[0]['name'], $("#upload")[0].files[0]['type'], name);
    deleteFile()

}
/**
 * Reception et affichage du fichier
 */
function receiveFile (link, user)
{
    // On récupère l'extension du fichier
    let ext = link.slice(link.indexOf("."), link.length).replace(".","");
    // On ajoute le nom du fichier dans la preview
    if ((ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg"))
    {
        // On charge l'image et on l'ajoute dans une balise img avec le message
        $('#chat #messages').append(
            '<div class="message">'
            + '<span class="user">' + user + '</span> '
            + '<div class="image-message">'
            + '<a href="files/'
            + link
            + '" target="_blank">'
            + '<img src="files/'
            + link
            +'"></a>'
            + '</div>'
            + '</div>'
        );
    } else
    {
        // On ajoute une image d'illustration et un lien de téléchargement
        $('#chat #messages').append(
            '<div class="message">'
            + '<span class="user">' + user + '</span> '
            + '<div class="file-message">'
            + '<img src="https://images.freeimages.com/fic/images/icons/2813/flat_jewels/512/file.png?ref=findicons">'
            + '<div class="download"'
            + '<span>'
            +  link
            + '</span>'
            + '<a href="files/'
            + link
            + '" download="'
            + link
            + '">Télécharger</a>'
            + '</div>'
            + '</div>'
        );
    }


    $('#chat #messages').scrollTop(function(){ return this.scrollHeight });  // scrolle en bas du conteneur
}