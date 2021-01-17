const Account = require('../models/Account');
const Transactions = require('../models/Transaction');
const auth = require('../middleware/Authenticate');
const authenticateSuperAgent = auth.authenticateSuperAgent;

module.exports = (app) => {

    app.get('/superagent/index',authenticateSuperAgent,async(req,res) =>{
        res.render('./superagent/index.ejs',{username : req.session.username})
    });
    app.get('/superagent',authenticateSuperAgent,async(req,res) =>{
        res.render('./superagent/index.ejs',{username : req.session.username})
    });
        
    app.get('/superagent/transfer',async(req , res) =>{
        const accounts = await Account.find({username : {$ne : req.session.username} , refferal : req.session.username});
        const fundsUSD = await Account.findById(req.session.userID).select("fundsUSD");
        const fundsLBP = await Account.findById(req.session.userID).select("fundsLBP");
        
        res.render('./superagent/transfer.ejs',{username : req.session.username,fundsUSD,fundsLBP,accounts})
    });

    app.get('/superagent/transactions',async(req , res) =>{
        const transactions = await Transactions.find({ $or : [{From : req.session.username} , {To : req.session.username}]});
        res.render('./superagent/transactions.ejs',{username : req.session.username,transactions : transactions})
    });

    app.get('/superagent/viewAgents',authenticateSuperAgent,async(req , res) =>{
        console.log(req.session.username);
    
        const results = await Account.find({refferal : req.session.username , level : 'agent'});
        res.render('./superagent/viewAgents.ejs',{agents : results,username : req.session.username})
    });

    app.get('/superagent/agentsBalance',authenticateSuperAgent,async(req , res) =>{
        const results = await Account.find({refferal : req.session.username , level : 'agent'});
        res.render('./superagent/agentsBalance.ejs',{agents : results,username : req.session.username})
    });

    app.get('/superagent/viewUsers',authenticateSuperAgent,async(req,res) =>{
        const results = await Account.find({level : "user" , superRefferal : req.session.username});
        res.render('./superagent/viewUsers.ejs',{username : req.session.username , users : results})
    });

    app.get('/superagent/viewUsersBalances',authenticateSuperAgent,async(req,res) =>{
        const results = await Account.find({level : "user" , superRefferal : req.session.username});
        res.render('./superagent/viewUsersBalances.ejs',{username : req.session.username , users : results})
    });

    app.get('/superagent/addAgent',authenticateSuperAgent,async(req,res) =>{
        let account = await Account.findOne({username : req.session.username});
        let rake = account.rake;
        let fundsUSD = account.fundsUSD;
        let fundsLBP = account.fundsLBP;
        res.render('./superagent/addAgent.ejs',{username : req.session.username , rake  , fundsUSD , fundsLBP })
    });

    app.get('/superagent/profile',async(req,res) =>{
        let account = await Account.findById(req.session.userID);
        res.render('./superagent/profile.ejs',{usernaaccount : req.session.username , account : me});
    });
    
    //other routes..
}