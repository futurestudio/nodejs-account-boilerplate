var UserAPI = require('../../server/api/user-api');

exports.signup = function(req, res){
    res.render('signup', { title: 'Signup as a customer' });
};

exports.postsignup = function(req, res){
    UserAPI.signupUser(req, function(result) {
            if (result.successful)
            {
                // attempt to log the user in right away
                req.login(result.result, function (err){
                    if (!err) {
                        res.redirect('/account');
                    } else {
                        res.render('signup', { phone: req.body.phone, email: req.body.email, errormessage: err});
                    }
                })
            }
            else {
                res.render('signup', { phone: req.body.phone, email: req.body.email, errormessage: result.error});
            }
        }
    );
};

exports.login = function(req, res){
    if (req.session.passport.user === undefined) {
        res.render('login', { title: 'Login' });
    }
    else {
        res.redirect('/account')
    }
};

// todo check if the next paramenter/callback is really necessary
exports.postlogin = function(req, res, next) {
    // check if there is at least some input
    if (req.body !== undefined) {
        // check if user clicked forgot passwort
        if (req.body.forgotPassword == "true"){
            UserAPI.forgotPassword(req, function(result) {
                    if (result.successful)
                    {
                        res.render('login', { title: 'Login', sendpwsuccessmessage: result.success});
                    }
                    else {
                        res.render('login', { sendpwerrormessage: result.error});
                    }
                }
            );
        }
        else {
            UserAPI.loginUser(req, function(result) {
                if (result.successful)
                {
                    // attempt to log the user in right away
                    req.logIn(result.user, function(err) {
                        if (err) {
                            res.render('login', { title: 'Login', email: req.body.email, errormessage: err});
                        }

                        res.redirect('/account');
                    });
                }
                else {
                    res.render('login', { title: 'Login', email: req.body.email, errormessage: result.error});
                }
            });
        }
    }
};

exports.resetpassword = function(req, res, next) {
    UserAPI.resetPasswordCheckToken(req, function(result) {
        if (result.successful) {
            res.render('reset-password', { user: user, useremail: user.email, token: req.query.token});
        }
        else {
            res.render('reset-password', { user: user, useremail: user.email, token: req.query.token, sendpwerrormessage: result.error });
        }
    });
};

exports.resetpasswordpost = function(req, res, next) {
    if (req.body !== undefined) {
        UserAPI.resetPasswordSaveNewPassword(req, function(result) {
            if (result.successful) {
                res.redirect('/login');
            }
            else {
                res.render('reset-password', { user: user, token: req.query.token, sendpwerrormessage: result.error });
            }
        });
    }
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
        UserAPI.deleteAccount(req, function(result) {
            if (result.successful) {
                res.redirect('/goodbye');
            }
            else {
                res.render('profile', { user: result.user, errormessage: result.error});
            }
        });
    }
    else {
        UserAPI.saveChangedProfileInformation(req, function(result) {
            if (result.successful) {
                res.render('profile', { user: result.user, successmessage: result.success});
            }
            else {
                res.render('profile', { user: result.user, errormessage: result.error});
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
