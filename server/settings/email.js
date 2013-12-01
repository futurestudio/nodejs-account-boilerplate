// TODO edit your credentials for an smtp server, for example
module.exports = {
    host        : 'smtp.gmail.com',
    user        : '<username>@gmail.com',
    password    : '<password>',
    sender      : 'nodejs-account-skeleton Company <username@gmail.com>',
    sendWelcomeEmail : false // if set to true every user gets a welcome email. this template is editable in modules/email-dispatcher.js
}