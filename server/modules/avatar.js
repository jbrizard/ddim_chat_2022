/*
 * Nom : Avatar
 * Description : GEstion des avatar
 * Auteur(s) : Clémentine Desrucques - Enzo Hardouin
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
    getAvatar: getAvatar
}

/* Get aléatoire avatar */
function getAvatar(avatarId) {
    return "<img src='/modules/avatar/" + avatarId + ".svg' alt='' width='30px'>";
}
