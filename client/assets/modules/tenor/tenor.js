// On commence le traitement grâce au lien passé en paramètre
socket.on('tenor_gif', (arg) => 
{
    // On appelle la fonction httpGetAsync
    httpGetAsync(arg,tenorCallbackSearch);
});

// Request asynchrone de l'URL
function httpGetAsync(theUrl, callback)
{
    // Création de l'objet Request
    var xmlHttp = new XMLHttpRequest();

    // On capture la réponse dès qu'elle apparaît
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            callback(xmlHttp.responseText);
        }
    }

    // On l'ouvre comme un GET call, on passe l'url et on passe l'async à Vrai
    xmlHttp.open("GET", theUrl, true);

    // Appel de la fonction send sans paramètres car ils sont passés directement dans le string de l'URL
    xmlHttp.send(null);

    return;
}

// Réponse contenant le top 8 des gifs de la recherche
function tenorCallbackSearch(responsetext)
{
    // On parse le json obtenu en réponse
    var responseObjects = JSON.parse(responsetext);

    top10gifs = responseObjects["results"];

    // On charge le gif obtenu et on l'affiche dans la balise envoyé par le bot Tenor

    gifs = document.getElementsByClassName("gifTenor");
    currentGif = gifs[gifs.length -1];
    currentGif.src = top10gifs[0]["media"][0]["nanogif"]["url"];

    return;
}