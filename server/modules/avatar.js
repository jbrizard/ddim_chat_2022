/*
 * Nom : Avatar
 * Description : GEstion des avatar
 * Auteur(s) : Clémentine Desrucques - Enzo Hardouin
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
    getRandomAvatar: getRandomAvatar
}

/* Get aléatoire avatar */
function getRandomAvatar() {
    return "<img src='/modules/avatar/01.svg' alt='' width='30px'>";
}
