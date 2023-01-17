/*
 * Nom : Avatar
 * Description : Gestion des avatars
 * Auteur(s) : Clémentine Desrucques - Enzo Hardouin
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
    getAvatar: getAvatar
}

/* Get aléatoire avatar */
function getAvatar(avatarId) 
{
    // test si avatarId est un nombre
    if (!isNaN(avatarId)) 
    {
        return "<img src='/modules/avatar/" + avatarId + ".svg' alt='' width='30px'>";
    } else
    {
        return "<img src='"+ avatarId + "' alt='' width='30px'>";
    }
}
