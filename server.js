
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const session = require('express-session');
const connection = require('./mongooseVar');
const app = express();
const port = process.env.PORT || 80;
const server = http.createServer(app);
server.listen(port,() => console.log(`Listening on localhost ${port}`))
const io = require("socket.io")({
  allowEIO3: true // false by default
});
io.listen(server);




const Hands = require('./models/Hand');


let possibilities = [];
let suits = ['Hearts','Clubs','Spades','Diamond'];
let ranks = ['1','2','3','4','5','6','7','8','9','10','11','12','13'];

suits.forEach((suit)=>{

  for(let i = 0 ; i < ranks.length ; i++){
    let card = `${ranks[i]} of ${suit}`;
    possibilities.push(card);
  }

})


let cards = possibilities;

shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



io.on('connection',(socket) => {
  console.log('A user connected');
  socket.emit('working','working');
  socket.on('createGame',() =>{
      console.log('game created');
      let newHand = new Hands();
      newHand.save();  
  });
      socket.on('chat', (msg) => {

        console.log(msg);
        socket.emit('chat',{
          status:'Worked',
          msg : 'hello from server'
        });
        
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
const table1 = new Table({
  Name : 'table1',
  TableType : "Texas Hold'em",
  TableCurrency : "USD",
  MaxCapacity : 8
});
const table2 = new Table({
  Name : 'table2',
  TableType : "Omaha",
  TableCurrency : "LBP",
  MaxCapacity : 9
});
table1.save();
table2.save();

app.use('/api',AuthRoute);
app.use('/moderator',ModeratorRoute);
app.use('/superagent',SuperAgentRoute);
app.use('/agent',AgentRoute);
require('./routes/SuperAgentRender')(app);
require('./routes/AgentRender')(app);

require('./routes/AuthRender')(app);



// app.use('/agentaccount',AgentRender);


