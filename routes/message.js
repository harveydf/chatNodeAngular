/**
 * Created by harveydf on 20/12/14.
 */
var pg = require('pg');

(function () {
    var conString = "postgres://postgres:postgres@localhost/chat";

    exports.findAll = function(callback){
        var messages = [];
        pg.connect(conString, function (err, client, done) {
            var query = client.query('SELECT username, text FROM messages LIMIT 100');

            query.on('row', function(row){
                messages = [{
                    'userName': row.username,
                    'messageText': row.text
                }];
            });

            query.on('end', function () {
                done();
                return callback(messages);
            })
        });
    };

})();
