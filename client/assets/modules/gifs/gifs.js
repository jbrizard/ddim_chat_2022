// Click event on gifs popover
$('#send-gif').on('click', function(event)
{
    if ($(event.target)[0].id == "send-gif")
    {
        $('#tooltip').fadeToggle(100);
    }
});
// Triggering search
var keyupTimer;

$('#search-gif').keyup(function(e)
{
    clearTimeout(keyupTimer);

    keyupTimer = setTimeout(function ()
    {
        //API CALL
        console.log('up');
        sendSearchGifs(e.target.value);
    }, 250);
});

function hydrateGifs(gifs)
{
    let gifsList = gifs['gifs'];
    $('#tooltip-body').empty();
    gifsList.forEach(function (item, index) {
        let img = $('<img />');
        img.attr('src',item.images.downsized.url);
        $('#tooltip-body').append(img);
    });
}

// Gestion des événements diffusés par le serveur
socket.on('results_search_gifs', hydrateGifs);