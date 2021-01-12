
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const connectionPass = require('mongooseVar');

// auth Middlewares
const Authenticate = require('./middleware/Authenticate');
const authAgent = Authenticate.authenticateAgent;
const authenticateSuperAgent = Authenticate.authenticateSuperAgent;

// app and port
const app = express();
const port = process.env.PORT || 9000;

// authRoute
const AuthRoute = require('./routes/AuthRoute');
const { param } = require('./routes/AuthRoute');


//models
const Table = require('./models/Tables');
const Logs = require('./models/Logs');
const Account = require('./models/Account');
const Transactions = require('./models/Transaction');


// configuring the server
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))
const connectionUrl = `mongodb+srv://admin:${connectionPass}@cluster0.34j59.mongodb.net/whatsappdb?retryWrites=true&w=majority`;
app.use(session({secret:"ui123uih1iu3h12iuh3",resave:false,saveUninitialized:true}));
app.use(express.static(__dirname + '/views/public'));
app.use('/img',express.static(__dirname + '/views/images/'));
app.set('view-engine','ejs');

// connection to db

mongoose.connect(connectionUrl,{
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true
});
mongoose.connection.once('open',(err) => {
    if(err) console.log(err)
    else console.log("connected")
})

/// Logging
addLog = (logType , logDescription ) =>{
 
    let log = new Logs({
        logType : logType,
        logDescription : logDescription
    })
    log.save();


}
app.get('/superAgent/viewLogs',(req,res) =>{
    Logs.find({},(err,resp) =>{
        if(err) res.json({error : 'error'});
        else{
            
            res.render('./superAgent/viewLogs.ejs',{results : resp});
        }
    })

})







/// Login page

app.get('/',(req , res) =>{
    res.render('./login.ejs');
})





//// SUPER AGENT CODE


app.get('/superAgent/addUser',authenticateSuperAgent,async(req,res) =>{
    res.render('./superAgent/addUser.ejs',{username : req.session.username})
})


app.get('/superagent/viewAgents',authenticateSuperAgent,async(req , res) =>{
    console.log(req.session.username);

    const results = await Account.find({refferal : req.session.username , level : 'agent'});
    res.render('./superAgent/viewAgents.ejs',{agents : results,username : req.session.username})
});

app.get('/superagent/viewTables',authenticateSuperAgent,async(req , res) =>{
    const results = await Table.find();
    res.render('./superAgent/viewTables.ejs',{tables : results})
});

app.get('/superagent/addTable',authenticateSuperAgent,async(req , res) =>{
    res.render('./superAgent/addTable.ejs')
});

app.get('/superagent/Deposit',async(req , res) =>{
    res.render('./superAgent/deposit.ejs')
});


    
app.get('/registerModerator',async(req,res) =>{
    res.render('./registerModerator.ejs')

})
    
app.get('/superagent/Withdraw',async(req , res) =>{
    // console.log('Withdraw controller');
    // const results = await Account.find();
    // console.log(req.session.userID);
    // const myInfo = await SuperAgent.findOne({username : req.session.username});
    // console.log(myInfo);
    res.render('./superAgent/withdraw.ejs')
});

app.get('/superagent/transfer',async(req , res) =>{
    const accounts = await Account.find({username : {$ne : req.session.username}});
    const balance = await Account.findById(req.session.userID).select("funds");
    res.render('./superAgent/transfer.ejs',{username : req.session.username,funds:balance,accounts:accounts})
});


app.get('/superagent/transactions',async(req , res) =>{
    const transactions = await Transactions.find({});
    res.render('./superAgent/transactions.ejs',{username : req.session.username,transactions : transactions})
});

app.get('/superagent/profile',async(req,res) =>{
    let me = await Account.findById(req.session.userID);
    res.render('./superagent/profile.ejs',{username : req.session.username , account : me});
})

app.get('/superagent/Withdraw',(req,res) =>{
    res.render('./superAgent/withdraw.ejs');
})


app.get('/superagent/ResetPassword',(req,res) =>{
    res.render('./superAgent/resetPassword.ejs');
})


app.get('/superAgent/editTable/:tableId',authenticateSuperAgent,(req,res) =>{
    Table.findById(req.params.tableId,'Name MaxCapacity MinStake Rake',(err , result) =>{
        if(err){
            res.json('error');
        }

        else{
            console.log(result);
            
            res.render('./superAgent/editTable.ejs',{result : result , id : req.params.tableId});
        }
    })

});


app.post('/superAgent/updateAgentInfo/:agentId/',(req,res) =>{



    let agentId = req.params.agentId;
    let test = req.params.username
    let username = req.body.username;

    Account.findByIdAndUpdate({_id:agentId},{username:username},(err , result) =>{
        if(err) return res.json('error');
        else if(result) return res.redirect('/superAgent/ViewAgents');
    });

});



app.post('/superAgent/updateTableInfo/:TableId/',(req,res) =>{



    let TableId = req.params.TableId;
    let test = req.params.username
    let Name = req.body.Name;
    let MaxCapacity = req.body.MaxCapacity;
    let MinStake = req.body.MinStake
    let Rake = req.body.Rake;

    console.log(req.body);
    Table.findByIdAndUpdate({_id:TableId},{Name,MaxCapacity,MinStake,Rake},(err , result) =>{
        if(err) return res.json('error');
        else if(result) {
            addLog('Added Table',`${req.session.username} updated a table's name to ${req.body.Name}`);   
            return res.redirect('/superAgent/ViewTables');
        }
    });

});




app.get('/superAgent/editAgent/:AgentId',authenticateSuperAgent,(req,res) =>{
    Account.findById(req.params.AgentId,'username',(err , result) =>{
        if(err){
            res.json('error');
        }

        else{
            console.log(result);
            res.render('./superAgent/editAgent.ejs',{result : result,id:req.params.AgentId});
        }
    })

});





app.get('/superagent/index',authenticateSuperAgent,async(req,res) =>{
    const logs = await Logs.find({});
    res.render('./superagent/index.ejs',{username : req.session.username,logs : logs})
});


app.get('/registerSuperAgent',async(req,res) =>{
    res.render('./registerSuperAgent.ejs')

})


app.get('/superagent/addAgent',authenticateSuperAgent,(req,res) =>{
    res.render('./superAgent/addAgent.ejs',{username : req.session.username})
})

app.get('/superagent/viewUsers',authenticateSuperAgent,async(req,res) =>{
    const results = await Account.find({level : "user"});
    res.render('./agent/viewUsers.ejs',{users : results})
})


//// AGENT CODE

app.get('/agent/viewUsers',authAgent,async(req,res) =>{
    const results = await User.find({level : "user"});
    res.render('./agent/viewUsers.ejs',{results : results})
})


app.get('/agent/addUser',authAgent,async(req,res) =>{
    res.render('./agent/addUser.ejs')
})



///// API CALLS


app.use('/api',AuthRoute);




app.listen(port,() => console.log(`Listening on localhost ${port}`))