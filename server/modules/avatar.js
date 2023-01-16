/*
 * Nom : Avatar
 * Description : GEstion des avatar
 * Auteur(s) : Clémentine Desrucques - Enzo Hardouin
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
    getRandomAvatar: getRandomAvatar
}

var list = new Map();

/* Get aléatoire avatar */
function getRandomAvatar(name) {
    let id = 0;
    if (!list.has(name)) {
        id = Math.floor(Math.random() * 5) + 1;
        list.set(name, id);
    }

    return "<img src='/modules/avatar/" + list.get(name) + ".svg' alt='' width='30px'>";
}
