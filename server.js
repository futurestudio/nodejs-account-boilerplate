/**
 * Created by npeitek on 11/7/13.
 */

var app = require('./server/app')();

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});