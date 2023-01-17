// liste des touches autorisées
var allowedKeys = 
{
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    66: 'b'
};
  
// La séquence du code konami
var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

// Une variable pour se rappeler de la 'position' que l'utilisateur a atteinte
var konamiCodePosition = 0;
  
// Ajout de l'event listener lorsqu'un touche est tapée
document.addEventListener('keydown', function(e)
{
    // Récuperer la valeur du code de la touche de la liste des touches
    var key = allowedKeys[e.keyCode];
    
    // Récupérer la valeur de la clé nécessaire du code konami
    var requiredKey = konamiCode[konamiCodePosition];

    // Comparaison de la touche avec la touche nécessaire
    if (key == requiredKey)
    {
        // Déplacer la prochaine touche dans la séquence du code konami
        konamiCodePosition++;

        // Si la dernière touche est atteinte, on active le code konami
        if (konamiCodePosition == konamiCode.length) 
        {
            socket.emit('konami');
            konamiCodePosition = 0;
        }
    }
    else 
    {
        konamiCodePosition = 0;
    }
});

// Si le message est du type "activate_konami", on active le code konami
socket.on('activate_konami', activateKonami);

// Activation du code konami
function activateKonami()
{
    // Modification du background en le remplaçant par un gif (nyancat)
    $('body').css('background', "url('images/nyancat.gif')");

    // 5 secondes après, on remet le background à sa couleur originale
    setTimeout(function()
    {
        $('body').css('background', "#888");
    }, 3000);
}