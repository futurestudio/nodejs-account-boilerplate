/**
 * Created by npeitek on 11/7/13.
 */

var http = require('http'),
    app = require('./server/app')();

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});