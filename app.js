/**
 * Created by harveydf on 20/12/14.
 */

var express     = require('express'),
    morgan      = require('morgan'),
    path        = require('path'),
    bodyParser  = require('body-parser'),
    app         = express(),
    http        = require('http').Server(app),
    io          = require('socket.io')(http),
    routes      = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routes);

app.get('/', function (req, res) {
    res.render('chat');
});

io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on('send message', function (data) {
        io.emit('get message', data);
    });
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function() {
    console.log('Express server listening on port ' + http.address().port);
});
