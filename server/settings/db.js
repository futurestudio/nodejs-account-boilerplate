/**
 * Created by npeitek on 11/7/13.
 */

var mongoose = require('mongoose');

// TODO add your connection string to your mongodb instance, for example
mongoose.connect("mongodb://<username>:<password>@<server>.mongolab.com:<server>/<database>");

module.exports = mongoose.connection;