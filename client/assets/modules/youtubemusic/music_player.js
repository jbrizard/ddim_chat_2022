// Si un message activate_youtube_music, on lance le traitement
socket.on('activate_youtube_music', (arg) => {
    
    // Retirer l'attribut "class" du premier élément AUDIO créé s'il y en a au moins 2
    if (!document.getElementsByClassName('youtube')[1])
    {
      // PASS
    }
    else {
      document.getElementsByClassName('youtube')[0].removeAttribute("class");
    }

    // Déclaration de variables utiles au traitement
    var audioTag = document.getElementsByClassName('youtube')[0];
    var vid = arg;
    var audioStreams = {};

    // Gestion et formation du lien youtube
    var vidLink = "https://www.youtube.com/embed/"+vid;
    youtubeLink = document.getElementsByClassName('ytb_link');
    youtubeLink = youtubeLink[youtubeLink.length - 1];
    youtubeLink.textContent = youtubeLink.textContent + vidLink;
    youtubeLink.href = vidLink;

    // Traitement complet pour customiser la balise audio, et y intégrer la bande son
    fetch("https://images" + ~~(Math.random() * 33) + "-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=" + encodeURIComponent("https://www.youtube.com/watch?hl=en&v=" + vid)).then(response => {
        if (response.ok) 
        {
            response.text().then(data => {

                // Globalement, on récupère tous les streams audios
                var regex = /(?:ytplayer\.config\s*=\s*|ytInitialPlayerResponse\s?=\s?)(.+?)(?:;var|;\(function|\)?;\s*if|;\s*if|;\s*ytplayer\.|;\s*<\/script)/gmsu;

                data = data.split('window.getPageData')[0];
                data = data.replace('ytInitialPlayerResponse = null', '');
                data = data.replace('ytInitialPlayerResponse=window.ytInitialPlayerResponse', '');
                data = data.replace('ytplayer.config={args:{raw_player_response:ytInitialPlayerResponse}};', '');

                var matches = regex.exec(data);
                var data = matches && matches.length > 1 ? JSON.parse(matches[1]) : false;

                var streams = [];
                var result = {};

                if (data.streamingData) 
                {
                    if (data.streamingData.adaptiveFormats) 
                        streams = streams.concat(data.streamingData.adaptiveFormats);

                    if (data.streamingData.formats) 
                        streams = streams.concat(data.streamingData.formats);
                } 
                else
                {
                    return false;
                }

                // Affectation des bandes son trouvées
                streams.forEach(function(stream, n) 
                {
                    var itag = stream.itag * 1;
                    var quality = false;
                    switch (itag) 
                    {
                        case 139:
                          quality = "48kbps";
                          break;
                        case 140:
                          quality = "128kbps";
                          break;
                        case 141:
                          quality = "256kbps";
                          break;
                        case 249:
                          quality = "webm_l";
                          break;
                        case 250:
                          quality = "webm_m";
                          break;
                        case 251:
                          quality = "webm_h";
                          break;
                    }
                    if (quality) 
                        audioStreams[quality] = stream.url;
                });

                // Affectation de la bande son parmis les 3 qualités de son suivantes
                audioTag.src = audioStreams['256kbps'] || audioStreams['128kbps'] || audioStreams['48kbps'];
                audioTag.play();
            })
        }
    });
});
