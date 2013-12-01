var UserAPI = require('../api/user-api');

exports.signUpUser = function(req, res){
    UserAPI.signupUser(req, function(result) {
        if (result.successful)
        {
            // attempt to log the user in right away
            res.status(200).send('Registration successful');
        }
        else {
            res.status(400).send(result.error);
        }
    });
};

exports.loginUser = function(req, res){
    UserAPI.loginUser(req, function(result) {
        if (result.successful)
        {
            res.json(result.user);
        }
        else {
            res.status(400).send(result.error);
        }
    });
};

exports.deleteAccount = function(req, res){
    UserAPI.deleteAccount(req, function(result) {
        if (result.successful)
        {
            // attempt to log the user in right away
            res.status(200).send('Account deleted');
        }
        else {
            res.status(400).json(result.user);
        }
    });
};