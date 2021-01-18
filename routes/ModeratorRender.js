const Account = require('../models/Account');
const Transactions = require('../models/Transaction');
const auth = require('../middleware/Authenticate');
const authModerator = auth.authModerator;

module.exports = (app) => {
    app.get('/moderator',authModerator,async(req,res) =>{
        let superagents = await Account.countDocuments({level : 'superagent'}) || 0;
        let agents = await Account.countDocuments({ level : 'agent' }) || 0;
        let players = await Account.countDocuments({ level : 'player'}) || 0;
        let allUsers = superagents + agents + players;
    
        res.render('./moderator/index.ejs',{username : req.session.username,superagents,agents,players,allUsers})
    });
    app.get('/moderator/index',authModerator,async(req,res) =>{
        let superagents = await Account.countDocuments({level : 'superagent'}) || 0;
        let agents = await Account.countDocuments({ level : 'agent' }) || 0;
        let players = await Account.countDocuments({ level : 'player'}) || 0;
        let allUsers = superagents + agents + players;
    
        res.render('./moderator/index.ejs',{username : req.session.username,superagents,agents,players,allUsers})
    });
    app.get('/moderator/transfer',authModerator,async(req,res) =>{
        const accounts = await Account.find({username : {$ne : req.session.username}});
        const fundsUSD = await Account.findById(req.session.userID).select("fundsUSD");
        const fundsLBP = await Account.findById(req.session.userID).select("fundsLBP");
        res.render('./moderator/transfer.ejs',{username : req.session.username , accounts , fundsUSD , fundsLBP})
    });
    app.get('/moderator/transactions',authModerator,async(req,res) =>{
        let transactions = await Transactions.find({});
        res.render('./moderator/transactions.ejs',{username : req.session.username , transactions})
    
    
    })
    app.get('/moderator/addSuperagent',authModerator,async(req,res) =>{
        res.render('./moderator/addSuperagent.ejs',{username : req.session.username})
    });
    
    app.get('/moderator/viewAllUsers',authModerator,async(req,res) =>{
        let users = await Account.find({username : {$ne : req.session.username}});
        res.render('./moderator/viewAllUsers.ejs',{username : req.session.username , users});
    })
    
    app.get('/moderator/viewAllBalances',authModerator,async(req,res) =>{
        let users = await Account.find({username : {$ne : req.session.username}});
        res.render('./moderator/viewAllBalances.ejs',{username : req.session.username , users});
    })
    app.get('/moderator/editUser/:accountId',authModerator,async(req,res) =>{
        let accountId = req.params.accountId;
        let user = await Account.findById(accountId);
        res.render('./moderator/editUser.ejs',{username : req.session.username , user});
    })

}