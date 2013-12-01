/**
 * Created by npeitek on 11/8/13.
 */
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// User schema
// add or delete things if required
// it is recommended to not delete anything besides phone
var userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true},
    password: { type: String, required: true},
    password_reset_token: { type: String, required: false},
    password_reset_deadline: { type: Date, required: false},
    auth_token: { type: String, required: false, unique: true },
    auth_token_issued: { type: Date, required: false}});

// Bcrypt middleware
userSchema.pre('save', function(next) {
    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// don't send the password/hash
userSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

// Export user model
var userModel = mongoose.model('User', userSchema);
exports.userModel = userModel;
