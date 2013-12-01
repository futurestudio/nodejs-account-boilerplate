var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    userSchema = require('./../schemas/users');

passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function (email, password, done) {
        userSchema.userModel.findOne({ email: email }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'Unknown user ' + email });
            }

            user.comparePassword(password, function(err, isMatch) {
                if (err)
                    return done(err);

                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    userSchema.userModel.findById(id, function (err, user) {
        done(err, user);
    });
});

// Simple route middleware to ensure user is authenticated. Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

// Check for admin middleware, this is unrelated to passport.js
// You can delete this if you use different method to check for admins or don't need admins
exports.ensureAdmin = function ensureAdmin(req, res, next) {
    return function(req, res, next) {
        console.log(req.user);
        if(req.user && req.user.role === "Admin")
            next();
        else
            res.send(403);
    }
}

module.exports = passport;