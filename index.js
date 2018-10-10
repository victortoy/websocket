var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var five = require('johnny-five')
var board = new five.Board()

board.on('ready', function(){
	var led = new five.Led(8)
	var temperatura = new five.Thermometer({
		controller: "LM35",
		pin: "A0"
	})
	var foto = new five.Sensor({
		pin:"A1",
		freq: 250
	})

	io.on('connection', function(socket){
		console.log('Se conecto alguien ')

		socket.on('encender', function(){
			led.on()
		})

		socket.on('apagar', function(){
			led.off()
		})

		temperatura.on("change", function(){
			let t = {
				valor: this.celsius,
				escala: 'celsius'
			}
			socket.emit('mensajetemperatura',t)
		})

		foto.on("data", function(){
			let y = {
				valor: this.value
			}
			socket.emit('mensajefoto',y)
		})
	})
})

app.use(express.static('public'))

server.listen(3000, function(){
	console.log('conectado al puerto 3000')
})