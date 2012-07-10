/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	io = require('socket.io');

var app = module.exports = express.createServer();
app.register('.html', require('ejs'));
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3010, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

var socket = io.listen(app, {log: false});
var clients = {};

socket.sockets.on('connection', function(client) {
	console.log('NEW CLIENT: ' + client.id);
	
	clients[client.id] = client;
	client.emit('your_id', client.id);
	
	//listeners
	client.on('disconnect', function(){
		console.log('HARAKIRI: ' + client.id);
		client.broadcast.emit('disconnect', client.id);
	});
	
	client.on('client_move', function(data) {
		data.id = client.id;
		client.broadcast.emit('move', data);
	});
});
