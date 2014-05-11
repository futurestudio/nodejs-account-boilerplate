var UserAPI = require('../api/user-api');

/*
 USER FUNCTIONS WITHOUT API AUTHENTICATION
 */

exports.signUpUser = function(req, res){
    UserAPI.signupUser(req, function(err, user) {
        if (err)
        {
            res.send(400, err);
        }
        else {
            res.json(201, user);
        }
    });
};


exports.loginUser = function(req, res){
    UserAPI.loginUser(req, function(err, user) {
        if (err)
        {
            res.send(400, err);
        }
        else {
            res.json(user);
        }
    });
};

exports.deleteAccount = function(req, res){
    UserAPI.deleteAccount(req, function(err, result) {
        if (err)
        {
            res.json(400, err);
        }
        else {
            res.send(204, 'Account deleted');
        }
    });
};

/*
 USER FUNCTIONS WITH API AUTHENTICATION CHECK
 */
exports.getUserInfo = function(req, res){
    res.json(req.user);
};