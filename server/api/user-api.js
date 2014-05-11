/**
 * Created by Norman on 11/14/13.
 */

var UserSchema = require('../schemas/users');
var EmailDispatcher = require('../modules/email-dispatcher');
var helper = require('../modules/helper');
var validator = require('validator');
var passport = require('../../server/modules/auth');

// todo change to function(err, result) pattern
function saveUser(newUserObject, callback, tryCount) {
    // save the object to the database
    newUserObject.save(function (err) {
        if (err) {
            // created auth key is not unique, try again.
            // if this error occurs multiple times a different error is the problem, abort
            if (err.code == 11000
                && tryCount <= 5){
                newUserObject.auth_token = helper.createRandomString(32);
                saveUser(newUserObject, callback, (tryCount + 1));
            }
            else {
                return callback('the signup failed (unknown error)', null);
            }
        } else {
            // send a welcome email
            EmailDispatcher.dispatchWelcomeEmail(newUserObject, function (error) {
                if (error) {
                    // in case of an error
                    // this could potentially also mean that the email address is invalid
                    // you may throw an error here instead of just logging it
                    console.log(error);
                }
            });

            return callback(null, newUserObject);
        }
    });
}

exports.signupUser = function(req, callback) {
    if (!isEmailValid(req.body.email)){
        return callback('that is not a valid email', null);
    }

    if (!validator.isLength(req.body.password, 6))
    {
        return callback('the password needs to have at least 6 characters', null);
    }

    UserSchema.userModel.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            return callback(err, null);
        }

        // check if there is already an account with that email address
        if (user) {
            return callback('email is already registered', null);
        }

        // if there is no account with that email yet, create a new object
        var record = new UserSchema.userModel({
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            auth_token: helper.createRandomString(32),
            auth_token_issued: new Date(),
            register_date: new Date(),
            role: "Customer"
        });

        saveUser(record, callback, 0);
    });
}

exports.loginUser = function(req, callback){
    if (!isEmailValid(req.body.email)){
        return callback('that is not a valid email', null);
    }

    // checks went through, now try to log the user in
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return callback(err, null);
        }

        if (!user) {
            return callback(info.message, null);
        }

        return callback(null, user);
    })(req);
}

exports.forgotPassword = function(req, callback) {
    UserSchema.userModel.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            return callback(err, null)
        }

        // check if there is already an account with that email address
        if (!user) {
            return callback("email " + req.body.email +  " is unknown", null);
        }

        // generate auth token
        var token = helper.createRandomString(32);

        // add time limit, one day to click the link, otherwise it expires
        var password_reset_deadline = new Date();
        password_reset_deadline.setDate(password_reset_deadline.getDate() + 1);

        // write it to the database
        user.password_reset_token = token;
        user.password_reset_deadline = password_reset_deadline;
        user.save(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
        });

        // send email
        EmailDispatcher.dispatchResetPasswordLink(user, function(error)
        {
            if (error) {
                // in case of an error
                console.log(error);
                return callback(error, null);
            }
        });

        // it should go until here
        // if it did, everything should have worked as expected
        return callback(null, 'email send, please check your inbox');
    });
}

exports.resetPasswordCheckToken = function(req, callback) {
    // check if the clicked link is complete and all information are there
    if (req.query === undefined
        || req.query.email === undefined
        || req.query.token === undefined) {

        return callback('something went wrong, please try again', null);
    }

    // get user
    UserSchema.userModel.findOne({ email: req.query.email }, function(err, user) {
        if (err) {
            return callback(err, null);
        }

        if (!user) {
            return callback("no user found", null);
        }

        // check if the token is correct
        if (user.password_reset_token === undefined
            || user.password_reset_token !== req.query.token) {

            return callback('token is incorrect, please try again', null);
        }

        // check if the time isn't expired yet
        var currentTime = new Date();

        if (user.password_reset_deadline === undefined
            || user.password_reset_deadline < currentTime) {
            return callback('time is expired, please set a new password within 24 hours', null);
        }

        return callback(null, user);
    });
};

exports.resetPasswordSaveNewPassword = function(req, callback) {
    if (user.body === undefined) {

        return callback('missing input', null);
    }

    UserSchema.userModel.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            return callback(err, null);
        }

        if (user.password_reset_token === undefined
            || user.password_reset_token !== req.body.token) {

            return callback('token is incorrect, please try again', null);
        }

        user.password = req.body.password;

        user.save(function(err){
            if (err){
                return callback(err, null);
            }

            return callback(null, "success");
        });
    });
};

exports.saveChangedProfileInformation = function(req, callback) {
    // get the account
    UserSchema.userModel.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            return callback(err, null);
        }

        // check if there is already an account with that email address
        if (!user) {
            return callback('no user found', null);
        }

        // if email is not changeable, otherwise remove comment
        //user.email = req.body.email;
        user.phone = req.body.phone;

        if (req.body.password !== undefined && req.body.password !== ""){
            user.password = req.body.password;
        }

        user.save(function(err) {
            if (err) {
                return callback('an error occurred', null);
            }

            return callback(null, 'changed account information');
        });
    });
};

exports.checkAuthToken = function(req, callback) {
    UserSchema.userModel
        .findOne({ auth_token: req.headers.auth_token })
        .populate('subscriptions.merchant')
        .populate('merchant_info')
        .exec(function(err, user) {
            if (err) {
                return callback(err, null);
            }

            // if there is a user with that auth_token, accept request
            if (!user) {
                return callback("no user found with that auth-token", null);
            }

            return callback(null, user);
        });
};

exports.deleteAccount = function(req, callback) {
    // get the account
    UserSchema.userModel.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            return callback(err, null);
        }

        // check if there is already an account with that email address
        if (!user) {
            return callback("no user found", null);
        }

        user.remove(function(err) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, "success");
        });
    });
};


/*
 HELPER
 */

function isEmailValid(email) {
    if (!validator.isLength(email, 4))
    {
        return false;
    }

    // check if valid email format
    return validator.isEmail(email);
}
