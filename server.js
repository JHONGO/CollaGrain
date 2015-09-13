//==============Server with Express Framework[port:3700]==============//
var express = require("express");
var app = express();
var port = 1126;
var server = app.listen(port);



//=================Set ID ArrayList for User Checking===================//
//var GLOBAL_ID_ARRAY = new Array();
var ACTUAL_ID_ARRAY = new Array();



//====================Server HTTP Request/Respond=======================//
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/Recorder.html");
	console.log('Processing: Recorder.html');
});

app.get("/Granular", function(req, res){
	res.sendFile(__dirname + "/Granular.html");
	console.log('Processing: Granular.html');
});

app.get("/MainControl", function(req, res){
	res.sendFile(__dirname + "/MainControl.html");
	console.log('Processing: MainControl.html');
});



//==============Socket.io [port:3700]==============//
var io = require('socket.io').listen(server);

var ID_agent = '';

//Data transportation for socket.io's messages
io.on('connection', function(socket) {
	
	//Print out the GLOBAL clients which is using MainControl.html & Granular.html.
 	//GLOBAL_ID_ARRAY = Object.keys(io.engine.clients);	

	socket.on('MtoSV_message', function(data){
		
		//Add a contain() function into array module.
		Array.prototype.contains = function(obj) {
		    var i = this.length;
		    while (i--) {
		        if (this[i] === obj) {
		            return true;
		        }
		    }
		    return false;
		}
		//if update ID data, then...
		if(ID_agent != data.ID) {
			//use contain() method to check if current ID exists in the ACTUAL_ID_ARRAY.
			if(!ACTUAL_ID_ARRAY.contains(data.ID)) {
				//if not, then push in to ACTUAL_ID_ARRAY.
				ACTUAL_ID_ARRAY.push(data.ID);				
			}
		}

		data.actual_id_array = ACTUAL_ID_ARRAY;

		
		//transport the data out to Granular.html
		socket.broadcast.emit('SVtoG_message', data);

	});

});

io.on('connection', function(socket) {

	socket.on('effectIndex', function(data){
		socket.broadcast.emit('effectIndex', data);
		console.log(data);
	});

});

//Automatically update the actual client list in time interval.
setInterval(function() {
	for(var i = 0; i <= ACTUAL_ID_ARRAY.length; i++) {
		var id = ACTUAL_ID_ARRAY[i];
		//io.sockets.connected[id] can filter out the connected client ID. 
		if(io.sockets.connected[id] == undefined){
			//if the connected client ID doesn't exist, then delete that ID.
			ACTUAL_ID_ARRAY.splice(i, 1);
			console.log(ACTUAL_ID_ARRAY);
		}
	}
}, 1000);



//=======Putting Binaryjs into Server for Sending Audio Data Chunks from Client[port:9001]=======//
var BinaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');

binaryServer = BinaryServer({port: 9001});

binaryServer.on('connection', function(client) {
  console.log("New BinaryServer Connection.");
  var fileWriter = new wav.FileWriter('public/audio/sound.wav', {
    channels: 1,
    sampleRate: 44100,
    bitDepth: 16
  });

  client.on('stream', function(stream, meta) {
    console.log('New Stream Access.');
    stream.pipe(fileWriter);
    stream.on('end', function() {
      fileWriter.end();
    });
  });

  client.on('close', function() {
  	if (fileWriter != null) {
    	fileWriter.end();
  	}
  });
});