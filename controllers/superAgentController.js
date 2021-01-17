const Account = require('../models/Account');
const Table = require('../models/Tables');
const Logs = require('../models/Logs');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const Transactions = require('../models/Transaction');
addTransaction = (Type , From , To , Amount , Note , Currency ) =>{
 
    let log = new Transactions({
        Type : Type,
        From : From,
        To : To,
        Amount : Amount,
        Note : Note,
        Currency : Currency

    })
    log.save();


}
depositUSDFundsToAgent = (req,res) =>{

    let agentUsername = req.body.accountUSD ;
    let superAgentFunds = req.body.fundsUSD;
    const note = req.body.noteUSD || '';
    const filter = {username : agentUsername};
    const safilter = {username : req.session.username};
    const aupdate = {$inc : {fundsUSD : superAgentFunds}};
    const saupdate = {$inc : {fundsUSD : -superAgentFunds}};
    Account.findOneAndUpdate(filter , aupdate ,(err , doc) =>{
        if(err) return res.json({error : 'error' , err});
        else{
            Account.findOneAndUpdate(safilter , saupdate , (err2 , doc) =>{
                if(err2) return res.json({error : 'error'});
                else{
                    addTransaction('Deposit',req.session.username , agentUsername , superAgentFunds , note , 'USD');
                    return res.json({success : 'successs'})   
                }
            })
        }
    });


}
depositLBPFundsToAgent = (req,res) =>{

    let agentUsername = req.body.accountLBP ;
    let superAgentFunds = req.body.fundsLBP;
    const note = req.body.noteLBP || '';
    const filter = {username : agentUsername};
    const safilter = {username : req.session.username};
    const aupdate = {$inc : {fundsLBP : superAgentFunds}};
    const saupdate = {$inc : {fundsLBP : -superAgentFunds}};
    Account.findOneAndUpdate(filter , aupdate ,(err , doc) =>{
        if(err) return res.json({error : 'error' , err});
        else{
            Account.findOneAndUpdate(safilter , saupdate , (err2 , doc) =>{
                if(err2) return res.json({error : 'error'});
                else{
                    addTransaction('Deposit',req.session.username , agentUsername , superAgentFunds , note , 'LBP');
                    return res.json({success : 'successs'})   
                }
            })
        }
    });


}
withdrawUSDFundsFromAgent = (req,res) =>{

    let agentUsername = req.body.accountUSD ;
    let superAgentFunds = req.body.fundsUSD;
    const note = req.body.noteUSD || '';
    const filter = {username : agentUsername};
    const safilter = {username : req.session.username};
    const aupdate = {$inc : {fundsUSD : -superAgentFunds}};
    const saupdate = {$inc : {fundsUSD : superAgentFunds}};
    Account.findOne(filter , 'fundsUSD',async(err , doc) =>{
        if(err) return res.json({error : err});
        if(doc.fundsUSD < superAgentFunds) return res.json({insufficientFunds : `${agentUsername} does not have sufficient funds`});
        else{
            await Account.findOneAndUpdate(filter , aupdate);
            await Account.findOneAndUpdate(safilter , saupdate);
            addTransaction('Withdraw' , req.session.username , agentUsername , superAgentFunds , note , 'USD');
            return res.json({success : 'success'})
        }
    })
}
withdrawLBPFundsFromAgent = (req,res) =>{

    let agentUsername = req.body.accountLBP ;
    let superAgentFunds = req.body.fundsLBP;
    const note = req.body.noteLBP || '';
    const filter = {username : agentUsername};
    const safilter = {username : req.session.username};
    const aupdate = {$inc : {fundsLBP : -superAgentFunds}};
    const saupdate = {$inc : {fundsLBP : superAgentFunds}};
    Account.findOne(filter , 'fundsLBP',async(err , doc) =>{
        if(err) return res.json({error : err});
        if(doc.fundsLBP < superAgentFunds) return res.json({insufficientFunds : `${agentUsername} does not have sufficient funds`});
        else{
            await Account.findOneAndUpdate(filter , aupdate);
            await Account.findOneAndUpdate(safilter , saupdate);
            addTransaction('Withdraw' , req.session.username , agentUsername , superAgentFunds , note , 'LBP');
            return res.json({success : 'success'})
        }
    })
}

module.exports = {
    depositUSDFundsToAgent,
    depositLBPFundsToAgent,
    withdrawUSDFundsFromAgent,
    withdrawLBPFundsFromAgent,
}
