
# nodejs-account-boilerplate

[![wercker status](https://app.wercker.com/status/e7c05973023d996d7ccdbe65c3c6307e/s/master "wercker status")](https://app.wercker.com/project/bykey/e7c05973023d996d7ccdbe65c3c6307e)


## Futureflix
`nodejs-account-boilerplate` is outdated and currently unmaintained. You can still benefit from the ideas within this code.

We started **[learn hapi](http://learnhapi.com) as a learning path for the hapi web framework**. Become a hapi master while following the tutorial series.

<a href="http://learnhapi.com">	
  <img src="https://futurestud.io/images/badges/hapi-hero-md.svg" height="30" />	
</a>

You’ll build a complete app from start to finish. From zero to hero!

Check out the [Futureflix Starter Kit](https://github.com/fs-opensource/futureflix-starter-kit) for more details :tv:


-----


## Project Overview
This is a boilerplate for new projects based on node.js and MongoDB. It reduces the initial effort so you can start with the fun things, and not implement an account system for the 24th time. It also comes with required basic functionality, like access to the appropriate database based on the node-environment or internationalization.

This boilerplate is still under active development.

It has the following features (might be incompete):

- Accounts
  - Create new account
    - E-Mail/Password
    - via facebook (soon)
  - Edit account information
  - Change password
  - Secure forgot password reset
  - Session tracking for website
  - Blowfish-based password encryption (every password is hashed with an individual salt)

- Environment-based database access
  - set a different DB for development than production (or any stage you want)

- Full test coverage

- Internationalization
  - the website views (/public/views) display how to offer the website in multiple languages
  - the internationalization is currently incomplete, e.g. error message & API returns are currently only in English

## API
The boilerplate does not only provide you with a website and the necessary server functions, it also has a REST API to handle the account related things. Adding new endpoints is fast and easy. Perfect for new projects with mobile apps (or any platform which is able to send HTTP requests and de/serialize JSON).

- Requests are authenticated with a token (not username/password)
- The requests from the REST API and the website run against the same business logic, just the handling is different (see account methods as an example for new endpoints)

A fully functional android app boilerplate which uses the provided APIs is [available here](https://github.com/fs-opensource/android-boilerplate).

## Stack
You need the following core technologies to run **nodejs-account-boilerplate**:
- NodeJS
- MongoDB

Besides the core technologies it uses major components (this list is very likely incomplete):

* [Express.js](http://expressjs.com/) - Node.js Web Framework
* [Jade](http://jade-lang.com/) - HTML Templating Engine
* [EmailJS](http://github.com/eleith/emailjs) - Node.js > SMTP Server Middleware
* [Bcrypt](https://npmjs.org/package/bcrypt-nodejs) - For password encryption
* [FontAwesome](http://fortawesome.github.io/Font-Awesome/) - The iconic font designed for Bootstrap
* [Twitter Bootstrap](http://twitter.github.com/bootstrap/) - UI Component & Layout Library
* [Mocha](https://npmjs.org/package/mocha) - node.js Testing framework

The website is based on the [Modern Business template](http://startbootstrap.com/templates/modern-business/).

## Install
You have install NodeJS dependencies before usage

```
git clone git@github.com:fs-opensource/nodejs-account-boilerplate.git
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

### Tests

The provided functions are thoroughly tested. Run

```
mocha test
```

for our provided tests.

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
```

A full API documentation is available on Github at [/docs/api-docs](https://github.com/fs-opensource/nodejs-account-boilerplate/tree/develop/docs/api-doc)

### nginx

In case you're running the boilerplate on a nginx server, you might need to change the [Underscores in Headers](http://nginx.org/en/docs/http/ngx_http_core_module.html#underscores_in_headers) setting to on:

```
underscores_in_headers on
```

We are using underscores in some header parameters for the API. If you don't turn it on, the headers will be ignored and it won't work as expected.

## Contributions

We very warmly welcome any contributions. If it's bugs, feature requests or implementation, we enjoy feedback :)

## License

```
The MIT License (MIT)

Copyright (c) 2014 Future Studio (futurestud.io)

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

