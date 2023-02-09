const nodemailer = require('nodemailer');

/*
 * Nom : Mail
 * Description : Envoi un email
 * Auteur(s) : Justin Sornay
 */

// Définit les méthodes "publiques" (utilisation à l'extérieur du module)
module.exports =  {
	handleSendEmail: handleSendEmail
}

/**
 * 
 */
function handleSendEmail(data)
{
    const { firstName } = data;
    const { lastName } = data;
    const { comment } = data;

    const transporter = nodemailer.createTransport({
        host: "web.lucienpuget.fr",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'nodejs@lucienpuget.fr', // generated ethereal user
            pass: '76K!Pqen', // generated ethereal password
        },
    });
    console.dir('test')
    const mailConfigurations = {
        from: 'nodejs@lucienpuget.fr',
        to: 'ddim@yopmail.com',
        subject: `${firstName} ${lastName}`,
        text: comment
    };

    transporter.sendMail(mailConfigurations, function(error, info) {
        if (error) throw Error(error);
           console.log('Email Sent Successfully');
        console.log(info);
    });
}