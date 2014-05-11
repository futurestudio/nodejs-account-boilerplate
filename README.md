# nodejs-account-boilerplate

This is a boilerplate for new projects based on node.js  and MongoDB. It reduces the initial effort so you can start with the fun things, and not implement an account system for the 24th time.

It has the following features:

- Accounts
  - Create new account
    - E-Mail/Password
    - via facebook (soon)
  - Edit account information
  - Change password
  - Secure forgot password reset
  - Session tracking for website
  - Blowfish-based password encryption (every password is hashed with an individual salt)

- 

## API
The boilerplate does not only provide you with a website and the necessary server functions, it also has a REST API to handle the account related things. Adding new endpoints is fast and easy. Perfect for new projects with mobile apps (or any platform which is able to send HTTP requests and de/serialize JSON).

- Requests are authenticated with a token (not username/password)
- The requests from the REST API and the website run against the same business logic, just the handling is different (see account methods as an example for new endpoints)

We'll soon provide a boilerplate for a matching android app.

## Stack
You need the following core technologies to run **nodejs-account-boilerplate**:
- NodeJS
- MongoDB

Besides the core technologies it uses (this list may be incomplete):

* [Express.js](http://expressjs.com/) - Node.js Web Framework
* [Jade](http://jade-lang.com/) - HTML Templating Engine
* [EmailJS](http://github.com/eleith/emailjs) - Node.js > SMTP Server Middleware
* [Bcrypt](https://npmjs.org/package/bcrypt-nodejs) - For password encryption
* [FontAwesome](http://fortawesome.github.io/Font-Awesome/) - The iconic font designed for Bootstrap
* [Twitter Bootstrap](http://twitter.github.com/bootstrap/) - UI Component & Layout Library

The website is based on the [Modern Business template](http://startbootstrap.com/templates/modern-business/).

## Install
You have install NodeJS dependencies before usage

```
git clone git@github.com:peitek/nodejs-account-boilerplate.git
cd nodejs-account-boilerplate
npm install
```

Configure MongoDB server connection
```
nano server/settings/db.js
```

Configure E-Mail smtp server connection
```
nano server/settings/email.js
```

Start NodeJS server
```
node server
```

If everything is set up correctly, visit
```
localhost:3000
```

### REST API

A request to the REST API to signup a new user could look like this (use a tool like [postman](http://getpostman.com/) to quickly test the API):

```
POST /api/user/signup HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{ 
  "email":"testuser@gmail.com",
  "phone":"0123456789",
  "password":"password"
}

A full API documentation will be added soon.


## Contributions

We very warmly welcome any contributions. If it's bugs, feature requests or implementation, we enjoy feedback :)

I sincerely thank @marcuspoehls for his outstanding help & valuable input.

```
