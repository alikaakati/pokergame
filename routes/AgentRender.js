const Account = require('../models/Account');
const Transactions = require('../models/Transaction');
const auth = require('../middleware/Authenticate');
const authAgent = auth.authenticateAgent;

module.exports = (app) => {

    app.get('/agent/index',authAgent,async(req,res) =>{
        res.render('./agent/index.ejs',{username : req.session.username})
    });

    app.get('/agent/transfer',authAgent,async(req,res) =>{
        const accounts = await Account.find({username : {$ne : req.session.username} , refferal : req.session.username});
        const fundsUSD = await Account.findById(req.session.userID).select("fundsUSD");
        const fundsLBP = await Account.findById(req.session.userID).select("fundsLBP");
    
        res.render('./agent/transfer.ejs',{username : req.session.username,fundsUSD,fundsLBP,accounts})
    })
    app.get('/agent/transactions',authAgent,async(req,res) =>{
        const transactions = await Transactions.find({ $or : [{From : req.session.username} , {To : req.session.username}]});
    
        res.render('./agent/transactions.ejs',{username : req.session.username,transactions})
    })
    app.get('/agent/viewUsers',authAgent,async(req,res) =>{
        const users = await Account.find({username : {$ne : req.session.username} , refferal : req.session.username});
        res.render('./agent/viewUsers.ejs',{username : req.session.username , users })
    })
    app.get('/agent/viewBalances',authAgent,async(req,res) =>{
        const users = await Account.find({username : {$ne : req.session.username} , refferal : req.session.username});
        res.render('./agent/viewBalances.ejs',{username : req.session.username , users})
    })
    
    
    
    app.get('/agent/addPlayer',authAgent,async(req,res) =>{
        let account = await Account.findOne({username : req.session.username});
        let rake = account.rake;
        let fundsUSD = account.fundsUSD;
        let fundsLBP = account.fundsLBP;
        res.render('./agent/addPlayer.ejs',{username : req.session.username , rake  , fundsUSD , fundsLBP })
    })
    
    
    
    
    
    //other routes..
}