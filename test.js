const app = require('express')();
const http = require('http').createServer(app);
const io = require("socket.io")(http,{pingTimeout: 10000, pingInterval: 30000});
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {

    io.emit('working');
    socket.on('chat', (msg) => {
    	var obj = JSON.parse(msg);
    	if (obj['email'] == "hadi@gmail.com" && obj['password'] == "123"){
    		console.log('login successful');
		io.emit('chat', {
			status: "OK",
			msg: "Loggin Succesfull"
		});
    	} else {
    		console.log('login failed');
		io.emit('chat', {
			status: "FAILED",
			msg: "Loggin Failed"
		});
	}
    	console.log(obj);
    });

	io.on('error', (err) => {
        console.log('Fluffy error', err)
    })
});
io.on('connect_error', err => handleErrors(err));
io.on('connect_failed', err => handleErrors(err));
io.on('disconnect', err => handleErrors(err));

http.listen(port, () => {
    console.log('Connected at ' + port);
});
