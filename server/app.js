
/**
 * Module dependencies.
 */

module.exports = function (db) {
    var express = require('express');
    var MongoStore = require('connect-mongo')(express);
    var passport = require('./modules/auth');

    // api
    var api = require('./routes/api');
    var UserAPI = require('./api/user-api');

    // website controller
    var routes = require('./../public/controller/');
    var user = require('./../public/controller/user');

    var path = require('path');
    var app = express();

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, '../public/views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'keyboard cat two', // that's a secret phrase to encrypt the session key
        store: new MongoStore({
            mongoose_connection: db
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(function (req, res, next) {
        res.set('X-Powered-By', 'nodejs-account-skeleton');
        next();
    });
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '../public/static')));

    // development only
    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }

    // include this block to force HTTPS on heroku.com deployments
    /*
    if ('development' != app.get('env')) {
        app.all('*',function(req,res,next){
            if (req.headers['x-forwarded-proto'] != 'https')
                res.redirect('https://delivery-sdp.herokuapp.com'+req.url)
            else
                next() //
        });
    }
    */

    /*
     API ROUTES
     */
    checkApiAuthentication = function(req, res, next) {
        // check if all information are there
        if (req.headers.auth_token == null) {
            res.status(401).send('Missing credentials');
        }

        // check if token is correct
        UserAPI.checkAuthToken(req, function(result) {
            if (result.successful) {
                // if the authentication goes through, add the user object to the request body
                req.body.user = result.user;
                next();
            }
            else {
                res.status(401).send('Not authorized: ' + result.error);
            }
        });
    };

    // user
    app.post('/api/user/login', api.loginUser);
    app.post('/api/user/signup', api.signUpUser);
    app.post('/api/user/delete', api.deleteAccount);


    // add session so I can access the session variable from every view
    // this is necessary to show "my account" or "login"
    websiteUserSession = function(req, res, next) {
        res.locals.session = req.session;
        next();
    };

    /*
     WEBSITE ROUTES
     */
    app.get('/', websiteUserSession, routes.index);

    // user routes for signup, login, account information and logout
    // user signup
    app.get('/signup', websiteUserSession, user.signup);
    app.post('/signup', websiteUserSession, user.postsignup);

    // user login
    app.get('/login', websiteUserSession, user.login);
    app.post('/login', websiteUserSession, user.postlogin);

    // reset password
    app.get('/reset-password', websiteUserSession, user.resetpassword);
    app.post('/reset-password', websiteUserSession, user.resetpasswordpost);

    // user account
    app.get('/account', websiteUserSession, user.account);
    app.get('/profile', websiteUserSession, user.profile);
    app.post('/profile', websiteUserSession, user.postprofile);
    app.get('/goodbye', websiteUserSession, user.goodbye);
    app.get('/logout', websiteUserSession, user.logout);

    return app;
}
