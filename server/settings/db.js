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
        // todo IMPORTANT double check, that this database is different from the above
        // this database is used by the tests, which completely drop (delete all content of) the database
        mongoose.connect("mongodb://127.0.0.1:27017/fsos-node-boilerplate-test");
    }

    return mongoose.connection;
}
