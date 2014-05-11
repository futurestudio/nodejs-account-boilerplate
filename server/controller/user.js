var UserAPI = require('../api/user-api');

exports.signup = function(req, res){
    res.render('signup', { title: 'Signup as a customer' });
};

exports.postsignup = function(req, res){
    UserAPI.signupUser(req, function(err, user) {
            if (err)
            {
                res.render('signup', { phone: req.body.phone, email: req.body.email, errormessage: err});
            }
            else {
                // attempt to log the user in right away
                req.login(user, function (err){
                    if (err) {
                        res.render('signup', { phone: req.body.phone, email: req.body.email, errormessage: err});
                    }
                    else {
                        res.redirect('/account');
                    }
                });
            }
        }
    );
};

exports.login = function(req, res){
    if (req.session.passport.user === undefined) {
        res.render('login', { title: 'Login' });
    }
    else {
        res.redirect('/account');
    }
};

// todo check if the next paramenter/callback is really necessary
exports.postlogin = function(req, res, next) {
    // check if there is at least some input
    if (req.body !== undefined) {
        // check if user clicked forgot password
        if (req.body.forgotPassword == "true"){
            UserAPI.forgotPassword(req, function(err, result) {
                    if (err)
                    {
                        res.render('login', { sendpwerrormessage: err});
                    }
                    else {
                        res.render('login', { title: 'Login', sendpwsuccessmessage: result});
                    }
                }
            );
        }
        else {
            UserAPI.loginUser(req, function(err, user) {
                if (err){
                    res.render('login', { title: 'Login', email: req.body.email, errormessage: err});
                }
                else {
                    // attempt to log the user in right away
                    req.logIn(user, function(err) {
                        if (err) {
                            res.render('login', { title: 'Login', email: req.body.email, errormessage: err});
                        }

                        if (user.role == "Merchant") {
                            res.redirect('/merchantsadmin/');
                        }
                        else {
                            res.redirect('/account');
                        }
                    });
                }
            });
        }
    }
};

exports.resetPassword = function(req, res) {
    UserAPI.resetPasswordCheckToken(req, function(err, user) {
        if (err) {
            res.render('reset-password', { useremail: req.query.email, token: req.query.token, sendpwerrormessage: err });
        }
        else {
            res.render('reset-password', { user: user, useremail: user.email, token: req.query.token});
        }
    });
};

exports.resetPasswordPost = function(req, res) {
    UserAPI.resetPasswordSaveNewPassword(req, function(err, result) {
        if (err) {
            res.render('reset-password', { token: req.query.token, sendpwerrormessage: err });
        }
        else {
            res.redirect('/login');
        }
    });
};

exports.account = function(req, res){
    if (req.session.passport.user === undefined) {
        res.redirect('/login');
    }
    else {
        res.render('account', { title: 'Welcome!', user: req.user });
    }
};

exports.profile = function(req, res){
    if (req.session.passport.user === undefined) {
        res.redirect('/login');
    }
    else {
        res.render('profile', { title: 'Account Profile', user: req.user });
    }
};

exports.postprofile = function(req, res){
    if (req.body.deleteAccount === "true"){
        UserAPI.deleteAccount(req, function(err, result) {
            if (err) {
                res.render('profile', { user: req.user, errormessage: err});
            }
            else {
                res.redirect('/goodbye');
            }
        });
    }
    else {
        UserAPI.saveChangedProfileInformation(req, function(err, result) {
            if (err) {
                res.render('profile', { user: req.user, errormessage: err});
            }
            else {
                res.render('profile', { user: req.user, successmessage: result});
            }
        });
    }
};

exports.goodbye = function(req, res) {
    res.render('goodbye');
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};
