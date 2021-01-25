
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const session = require('express-session');
const connection = require('./mongooseVar');
const app = express();
const port = process.env.PORT || 80;
const handSolver = require('pokersolver').Hand;
const server = http.createServer(app);
server.listen(port,() => console.log(`Listening on localhost ${port}`))
const io = require("socket.io")({
  allowEIO3: true // false by default
});


// let suits = ['h','c','s','d'];
// let ranks = ['A','2','3','4','5','6','7','8','9','T','J','Q','K'];
// let cards = [];

// suits.forEach(suit => {
//   ranks.forEach((rank) =>{
//     let card = `${rank}${suit}`;
//     cards.push(card);
//   })
// });
// shuffle = (array) => {
//   var currentIndex = array.length, temporaryValue, randomIndex;

//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {

//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;

//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }

//   return array;
// }
// cards = shuffle(cards);
// let hand1 = [];
// let hand2 = [];
// let hand3 = [];
// let hand4 = [];
// let hand5 =[];
// let hand6 = [];
// let hand7 = [];
// let hand8 = [];
// let hand9 = [];

// for(let i = 0 ; i < 7 ; i++){
//   hand1.push(cards.splice(i, 1)[0]);
//   hand2.push(cards.splice(i , 1)[0]);
//   hand3.push(cards.splice(i  , 1)[0]);
//   hand4.push(cards.splice(i  , 1)[0]);
//   hand5.push(cards.splice(i  , 1)[0]);
//   hand6.push(cards.splice(i  , 1)[0]);
//   hand7.push(cards.splice(i , 1)[0]);
//   hand8.push(cards.splice(i , 1)[0]);
//   hand9.push(cards.splice(i , 1)[0]);
  
  
// };

// hand1 = handSolver.solve(hand1);
// hand2 = handSolver.solve(hand2);
// hand3 = handSolver.solve(hand3);
// hand4 = handSolver.solve(hand4);
// hand5 = handSolver.solve(hand5);
// hand6 = handSolver.solve(hand6);

// let winner = handSolver.winners([hand1 , hand2 , hand3 ]);
// console.log(winner.toString());

// return;
io.listen(server);




const Hands = require('./models/Hand');




let players = {};

io.on('connection',(socket) => {
  console.log('A user connected');

  socket.on('joinRoom',( username , room ) =>{
    socket.join(room);
    socket.broadcast.to(room).emit('roomMessage' , `${username} joined ` + room);
    let player = {room : room , socketID : socket.id};
    players[username] = player;
    io.in(room).emit('message', 'cool game');
    console.log(players);
    
  });
  socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  })



mongoose.connect(connection.url,{
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true
});
mongoose.connection.once('open',(err) => {
    if(err) console.log(err)
    
})

// configuring the server
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))
app.use(session({secret:"ui123uih1iu3h12iuh3",resave:false,saveUninitialized:true}));
app.use('/img',express.static(__dirname + '/views/images/'));
app.use(express.static(__dirname + '/views/public'));
app.set('view-engine','ejs');
const AuthRoute = require('./routes/AuthRoute');
const ModeratorRoute = require('./routes/ModeratorRoute');
const SuperAgentRoute = require('./routes/SuperAgentRoutes');
const AgentRoute = require('./routes/AgentRoutes');
const Table = require("./models/Tables");

app.use('/api',AuthRoute);
app.use('/moderator',ModeratorRoute);
app.use('/superagent',SuperAgentRoute);
app.use('/agent',AgentRoute);
require('./routes/SuperAgentRender')(app);
require('./routes/AgentRender')(app);
require('./routes/ModeratorRender')(app);
require('./routes/AuthRender')(app);



// app.use('/agentaccount',AgentRender);


// room : [roomID]{
//   players : [
//     ali:{

//     },
//     hsn:{

//     }
//   ],
//   state : [started , ongoing , finished],
//   scores : {

//   };
// }