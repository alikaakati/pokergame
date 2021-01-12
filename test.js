const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
    console.log('a user connected');
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
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
http.listen(9000, () => {
    console.log('Connected at 9000');
});
