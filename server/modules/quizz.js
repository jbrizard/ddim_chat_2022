/*
 * Nom : Quizz !
 * Description : Ce module est un Quizz
 * Auteur(s) : Clem-Enzo
 */

module.exports = {
    handleQuizz: handleQuizz // permet d'appeler cette méthode dans server.js
}

// Liste question et de réponse oui ou non, reponse variée pour plus de fun
const questions = {
    "Est-ce que le ciel est bleu ?": "oui",
    "Le javascript est-il un langage de programmation ?": "oui",
    "Suis-je un robot ?": "non",
    "Le coeur d'une crevette est logé dans sa tête.": "oui",
    "Plus de 50% des gens, à travers le monde, n'ont jamais fait ou n'ont jamais reçu d'appels téléphoniques.": "oui",
    "Les mille-pattes ont 1000 pattes.": "non",
    "Le briquet a été inventé avant l'allumette.": "oui",
    "La Russie est le 2ème plus grand pays du monde.": "non",
    "La plupart des 'rouges à lèvres' contiennent des écailles de poisson.": "oui",
    "À l'origine, le Coca-Cola était vert.": "oui",
    "Le plus jeune Pape était âgé de 11 ans.": "oui",
    "Les gilets pare-balles, les escaliers de secours, les essuie-glace, les imprimantes laser ont tous été inventés par des femmes.": "oui",
    "G.O.L.F signifie Gentlemen Only, Ladies Forbidden.": "oui",
    "F.U.C.K. signifie Fornication Under Consent of King.": "oui",
}

//initialisation des variables
let start = false;
let awaitAnswer = false;
let randomAnswer = "non";

function handleQuizz(io, message)
{
    message = message.toLowerCase();

    //Si on appel le quizz ...
    if (message.includes('quizz') || io.sockets.quizz === true)
    {
        io.sockets.quizz = true;
        if (!start)
        {
            messagePerso(io, "Bienvenue dans le quizz");
            start = true;
            io.sockets.quizzScore = 0;
            awaitAnswer = false;
        }

        if (message.includes('quitte'))
        {
            messagePerso(io, "Bye !");
            io.sockets.quizz = false;
            start = false;
            return;
        }

        if (awaitAnswer)
        {
            if (message.includes('oui') || message.includes('non'))
            {
                if (message.includes(randomAnswer))
                {
                    io.sockets.quizzScore++;
                    messagePerso(io, "Bonne réponse, votre score est de " + io.sockets.quizzScore);
                } else { 
                    messagePerso(io, "Mauvaise réponse, votre score est de " + io.sockets.quizzScore);
                }
                awaitAnswer = false;
            }else {
                messagePerso(io, "Veuillez répondre par 'oui' ou 'non' ('quitte' pour quitter)");
            }
        }

        if(!awaitAnswer)
        {
          awaitAnswer = true;

          // get random question and answer from questions object and send it to the let randomAnswer = "non";
            let randomQuestion = Object.keys(questions)[Math.floor(Math.random() * Object.keys(questions).length)];
            randomAnswer = questions[randomQuestion];

            messagePerso(io, "Question: " + randomQuestion);
        }
    }
}

//Bloc de message du quizz
function messagePerso(io, message)
{
    io.sockets.emit('new_message',
        {
            name:'Quizz',
            message:'<span class="quizz"> ' + message + '</span>',
            avatar:"<img src='/modules/avatar/quizz.svg' alt='quizz avatar' width='30px'>"
        });
}
