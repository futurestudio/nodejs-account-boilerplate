/**
 * Created by npeitek on 11/7/13.
 */

var mongoose = require('mongoose');
module.exports = function (env) {

    /*
     the database selection depends on the environment
     reason: don't use the production/develop DB during tests (they delete the contents)
     */
    // TODO add your connection strings to your different mongodb instances
    // you can remove environments you don't use and add some, if you like
    if (env == 'production') {
        mongoose.connect("mongodb://<username>:<password>@<server>.mongolab.com:<server>/<database>");
    }
    else if (env == 'development'){
        mongoose.connect("mongodb://<username>:<password>@<server>.mongolab.com:<server>/<database>");
    }
    else {
        mongoose.connect("mongodb://<username>:<password>@<server>.mongolab.com:<server>/<database>");
    }

    return mongoose.connection;
}