let arobasing = false;

// Quand un texte est écrit dans le champ de message
$('#message-input').on('keyup', function(event)
{
    // Si la touche est [Tab, Up, Down]
    switch (event.which)
    {
        case 38:
        case 40:
        case 9:
            return;
    }

    let val = $('#message-input').val();
    let split = val.split(" ");

    // Si le dernier char est un espace, on ne cache le popover
    if (arobasing && (val.charAt(val.length-1) === " "))
    {
        $('.arobase-wrapper').hide();
        arobasing = false;
        return;
    }

    // Si le dernier mot est pas un @, on cache le popover
    if (!split[split.length-1].startsWith('@'))
    {
        $('.arobase-wrapper').hide();
        arobasing = false;
        return;
    }

    arobasing = true;

    // on vide notre liste d'utilisateurs
    $('#arobase-list').empty();

    // On prend la recherche de l'utilisateur
    const search = split[split.length-1].substring(1);
    let usersToShow = [];
    usersList.forEach(function(user){
        if (user.name.toUpperCase().startsWith(search.toUpperCase()) || search === '')
        {
            // si l'utilisateur répond à la recherche, ajouter à usersToShow
            usersToShow.push(user);
        }
    });

    // On trie les utilisateurs par ordre alphabétique
    usersToShow.sort(function (a,b){
        a = a.name.toUpperCase();
        b = b.name.toUpperCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
    })

    // On ajoute les utilisateurs à la liste en ne prenant que les 5 premiers
    usersToShow.slice(0,5).forEach(function (user,index){
        var el = $('<li></li>');

        // On active le premier élément de la liste
        if(index===0)
            el.addClass('active');

        el.text(user.name);
        $('#arobase-list').append(el);
    })

    // Si la liste est vide, on affiche un message
    if(usersToShow.length === 0)
        $('#arobase-list').append($('<span>Personne ici !</span>'));

    // On affiche le popover
    $('.arobase-wrapper').show();

});

// Quand on appuie sur une touche
$(document).on('keydown',function(event)
{
    // Si on est pas en train de faire un @, on ne fait rien
    if (!arobasing)
        return;

    // When pressing ARROW UP
    if (event.which === 38)
    {
        event.preventDefault();

        //up
        if($('#arobase-list li.active').prev('li').length)
        {
            $('#arobase-list li.active').prev('li').addClass('active');
            $('#arobase-list li.active:last').removeClass('active');
        }
        else
        {
            $('#arobase-list li.active').removeClass('active');
            $('#arobase-list li:last').addClass('active');
        }

    }

    // When pressing ARROW DOWN
    else if (event.which === 40)
    {
        event.preventDefault();

        //down
        if($('#arobase-list li.active').next('li').length)
        {
            $('#arobase-list li.active').next('li').addClass('active');
            $('#arobase-list li.active:first').removeClass('active');
        }
        else
        {
            $('#arobase-list li.active').removeClass('active');
            $('#arobase-list li:first').addClass('active');
        }

    }

    // When pressing TAB
    else if (event.which === 9)
    {
        event.preventDefault();

        let val = $('#message-input').val();
        let split = val.split(" ");

        split[split.length-1] = "@"+$('#arobase-list li.active').text();

        $('#message-input').val(split.join(' '));
    }
});