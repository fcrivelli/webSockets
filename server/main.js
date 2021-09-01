var express = require('express'); 
var app = express(); 
var server = require('http').Server(app); 
var io = require('socket.io')(server);

var products = [];

app.use(express.static('public')); 
app.get('/hello', function(req, res) {
  res.status(200).send("Hello World!");
});

io.on('connection', function(socket) { 
  console.log('Alguien se ha conectado con Sockets');   
  socket.emit('products', products); 
  socket.on('new-product', function(data) { 
    products.push(data); 
    io.sockets.emit('products', products); 
  }); 
});
 
server.listen(8080, function() { 
  console.log("Servidor corriendo en http://localhost:8080"); 
});