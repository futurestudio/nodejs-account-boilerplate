/**
 * Created by Norman on 11/14/13.
 */

var UserSchema = require('../schemas/users');
var EmailDispatcher = require('../modules/email-dispatcher');
var helper = require('../modules/helper');
var check = require('validator').check;
var passport = require('../../server/modules/auth');

function saveUser(record, callback, tryCount) {
    // save the object to the database
    record.save(function (err) {
        if (err) {
            // created auth key is not unique, try again.
            // if this error occurs multiple times a different error is the problem, abort
            if (err.code == 11000
                && tryCount <= 5){
                record.auth_token = helper.createRandomString(32);
                saveUser(record, callback, (tryCount + 1));
            }
            else {
                return callback({
                    successful: false,
                    error: 'the signup failed (unknown error)'
                });
            }
        } else {
            // send a welcome email
            EmailDispatcher.dispatchWelcomeEmail(record, function (error) {
                if (error) {
                    // in case of an error
                    // this could potentially also mean that the email address is invalid
                    // you may throw an error here instead of just logging it
                    console.log(error);
                }
            });

            callback({
                successful: true,
                result: record
            });
        }
    });
}
exports.signupUser = function(req, callback) {
    try
    {
        check(req.body.email).len(4,64).isEmail();
    }
    catch(err)
    {
        return callback({
            successful: false,
            error: 'that is not a valid email'
        });
    }

    try
    {
        check(req.body.password).len(6,128);
    }
    catch(err)
    {
        return callback({
            successful: false,
            error: 'the password needs to have at least 6 characters'
        });
    }

    UserSchema.userModel.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            return callback({
                successful: false,
                error: err
            });
        }

        // check if there is already an account with that email address
        if (user) {
            callback({
                successful: false,
                error: 'email is already registered'
            });
        }
        else {
            // if there is no account with that email yet, create a new object
            var record = new UserSchema.userModel({
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                auth_token: helper.createRandomString(32),
                auth_token_issued: new Date(),
                role: "Customer"
            });

            saveUser(record, callback, 0);
        }
    });
}

exports.loginUser = function(req, callback){
    try
    {
        check(req.body.email).len(4,64).isEmail();

        passport.authenticate('local', function(err, user, info) {
            if (err) {
                callback({
                    successful: false,
                    error: err
                });
            }

            if (!user) {
                callback({
                    successful: false,
                    error: info.message
                });
            }
            else {
                callback({
                    successful: true,
                    user: user,
                    error: 'Login successful'
                });
            }
        })(req);
    }
    catch(err)
    {
        callback({
            successful: false,
            error: 'that is not a valid email'
        });
    }

}

exports.forgotPassword = function(req, callback) {
    UserSchema.userModel.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            callback({
                successful: false,
                error: err
            });
        }

        // check if there is already an account with that email address
        if (user) {
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
                    callback({
                        successful: false,
                        error: 'an error occurred'
                    });
                }
            });

            // send email
            EmailDispatcher.dispatchResetPasswordLink(user, function(error)
            {
                if (error) {
                    // in case of an error
                    console.log(error);
                    callback({
                        successful: false,
                        error: 'an error occurred'
                    });
                }
            });

            // it should go until here
            // if it did, everything should have worked as expected
            callback({
                successful: true,
                success: 'email send, please check your inbox'
            });
        }
        else {
            callback({
                successful: false,
                error: "email " + req.body.email +  " is unknown"
            });
        }
    });
}

exports.resetPasswordCheckToken = function(req, callback) {
    // check if the clicked link is complete and all information are there
    if (req.query !== undefined
        && req.query.email !== undefined
        && req.query.token !== undefined) {

        // get user
        UserSchema.userModel.findOne({ email: req.query.email }, function(err, user) {
            if (err) { return done(err); }

            // check if the token is correct
            if (user.password_reset_token !== undefined
                && user.password_reset_token == req.query.token) {

                // check if the time isn't expired yet
                var currentTime = new Date();

                if (user.password_reset_deadline !== undefined
                    && user.password_reset_deadline > currentTime) {

                    callback({
                        successful: true
                    });
                }
                else {
                    callback({
                        successful: false,
                        error: "time is expired, please set a new password within 24 hours"
                    });
                }
            }
            else {
                callback({
                    successful: false,
                    error: "token is incorrect, please try again"
                });
            }
        });
    }
    else {
        callback({
            successful: false,
            error: "something went wrong, please try again"
        });
    }
};

exports.resetPasswordSaveNewPassword = function(req, callback) {
    UserSchema.userModel.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            console.log(err);
            callback({
                successful: false,
                user: user,
                error: "an error occurred"
            });
        }

        if (user.password_reset_token !== undefined
            && user.password_reset_token == req.body.token) {

            user.password = req.body.password;

            user.save(function(err){
                if (err){
                    console.log(err);
                    callback({
                        successful: false,
                        user: user,
                        error: "an error occurred"
                    });
                }
                else {
                    callback({
                        successful: true
                    });
                }
            });
        }
        else {
            callback({
                successful: false,
                user: user,
                error: "token is incorrect, please try again"
            });
        }
    });
};

exports.saveChangedProfileInformation = function(req, callback) {
    // get the account
    UserSchema.userModel.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            console.log(err);
            callback({
                successful: false,
                user: user,
                error: 'an error occurred'
            });
        }

        // check if there is already an account with that email address
        if (user) {
            // if email is not changeable, otherwise remove comment
            //user.email = req.body.email;
            user.phone = req.body.phone;

            if (req.body.password !== undefined && req.body.password !== ""){
                user.password = req.body.password;
            }

            user.save(function(err) {
                if (err) {
                    console.log(err);
                    callback({
                        successful: false,
                        user: user,
                        error: 'an error occurred'
                    });
                } else {
                    callback({
                        successful: true,
                        user: user,
                        success: 'changed account information'
                    });
                }
            });
        }
        else {
            console.log(err);
            callback({
                successful: false,
                user: user,
                error: 'an error occurred'
            });
        }
    });
};

exports.checkAuthToken = function(req, callback) {
    UserSchema.userModel.findOne({ auth_token: req.headers.auth_token }, function(err, user) {
        if (err) {
            callback({
                successful: false,
                error: err
            });
        }

        // if there is a user with that auth_token, accept request
        if (user) {
            callback({
                successful: true,
                user: user
            });
        }
        else {
            callback({
                successful: false,
                error: "an unknown error occurred"
            });
        }
    });
};

exports.deleteAccount = function(req, callback) {
    // get the account
    UserSchema.userModel.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            console.log(err);
            callback({
                successful: false,
                user: user,
                error: 'an error occurred'
            });
        }

        // check if there is already an account with that email address
        if (user) {
           user.remove(function(err) {
                if (err) {
                    console.log(err);
                    callback({
                        successful: false,
                        user: user,
                        error: 'an error occurred'
                    });
                } else {
                    callback({
                        successful: true
                    });
                }
            });
        }
        else {
            console.log(err);
            callback({
                successful: false,
                user: user,
                error: 'an error occurred'
            });
        }
    });
};