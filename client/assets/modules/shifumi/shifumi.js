// Lorsque l'utilisateur choisit un adversaire...
$(document).on('change', '#gamer-choice',function(){

    // Récupére le choix de l'utilisateur
    var playerId = $(this).val();

    // Envoi au server
    socket.emit('choosen_player', playerId);
});

// Lorsque l'utilisateur clique sur pierre, feuille ou ciseaux...
$(document).on('click', '.shifumi-choices',function(){
    console.log('ici');
    // Récupére le choix de l'utilisateur
    var choice = $(this).val();
    console.log(choice);
    // Envoi au server
    socket.emit('shifumi_choice', choice);
});
