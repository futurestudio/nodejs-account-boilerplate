// TODO edit your credentials for an smtp server
module.exports = {
    host        : 'smtp.gmail.com',
    user        : '<username>@gmail.com',
    password    : '<password>',
    sender      : 'nodejs-account-boilerplate Company <username@gmail.com>',
    sendWelcomeEmail : false // if set to true every user gets a welcome email. this template is editable in modules/email-dispatcher.js
}