/**
 * Created by harveydf on 20/12/14.
 */
var pg      = require('pg'),
    config  = require('../config.json');

(function () {

var conString = config.postgres.host;

exports.findAll = function(callback){
    var messages = [];
    pg.connect(conString, function (err, client, done) {
        var query = client.query('SELECT username, text FROM messages LIMIT 100');

        query.on('row', function(row){
            messages.push({
                'userName': row.username,
                'messageText': row.text
            });
        });

        query.on('end', function () {
            done();
            return callback(messages);
        })
    });
};

exports.save = function (data, callback) {
    pg.connect(conString, function(err, client, done){
        client.query('INSERT INTO messages(username, text) VALUES($1, $2)', [data.userName, data.messageText], function () {
            done();
            return callback();
        })
    });
};

})();
