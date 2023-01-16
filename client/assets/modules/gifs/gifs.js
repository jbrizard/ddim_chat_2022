/**
 * Click event on gifs popover
 */
$('#send-gif').click(function(event)
{
    if ($(event.target)[0].id == "send-gif")
    {
        $('#tooltip').fadeToggle(100);
        $('#search-gif').focus();
    }
});

$('#tooltip-body').on('scroll', function (event) {
    const scrolltop = $('#tooltip-body').scrollTop();
    const height = $('.tooltip-content').eq(0).height();
    const heightView = $('#tooltip-body').height();
    const limit = parseInt(height) - (2 * (parseInt(heightView)));

    if (scrolltop >= limit) {
        offset++;
        socket.emit('search_gifs', $('#search-gif').val(), offset);
    }
});

/**
 * Écoute sur la recherche de gif et lance l'event de recherche
 */
var keyupTimer;
$('#search-gif').keyup(function(e)
{
    clearTimeout(keyupTimer);
    // Debouncer
    keyupTimer = setTimeout(function ()
    {
        //API CALL
        if (e.target.value === '') {
            // si recherche vide, rechargement des trendings
            socket.emit('trending_gifs');
        } else {
            socket.emit('search_gifs', e.target.value, 0);
        }
    }, 350);
});

/**
 * Charge les gifs dans le popover
 * @param gifs
 */
let sizeLeft = 0.0;
let sizeRight = 0.0;
let offset = 0;
function hydrateGifs(gifs)
{
    if (gifs['offset'] == 0) {
        sizeLeft = 0;
        sizeRight = 0;
        offset = 0;

        $('.tooltip-content').empty();
    }

    let gifsList = gifs['gifs'];

    const contentLeft = $('.tooltip-content').eq(0);
    const contentRight = $('.tooltip-content').eq(1);

    gifsList.forEach(function (item, index)
    {
        let img = $('<img />');
        img.attr('src',item.images.downsized.url);
        img.click(sendGifs);

        let height = 172.5 * parseInt(item.images.downsized.height) / parseInt(item.images.downsized.width);

        if (sizeLeft <= sizeRight)
        {
            contentLeft.append(img);
            sizeLeft += height;
        }
        else
        {
            contentRight.append(img);
            sizeRight += height;
        }
    });
}

/**
 * Envoi un gif dans le chat
 */
function sendGifs()
{
    let url = $(this).attr('src');
    // ferme le popover de gif
    $('#tooltip').fadeToggle(100);
    // on vide l'input de recherche
    $('#search-gif').val('');
    // On recharge les trendings
    socket.emit('trending_gifs');
    // On envoit le gif au server
    socket.emit('gif', url);
}

// Gestion des événements diffusés par le serveur
socket.on('results_search_gifs', hydrateGifs);

// Chargement des gifs "trendings"
socket.emit('trending_gifs');