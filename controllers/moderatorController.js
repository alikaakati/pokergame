
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
depositUSDFundsToSuperAgent = (req,res) =>{

    let agentUsername = req.body.accountUSD ;
    let superAgentFunds = req.body.fundsUSD;
    const filter = {username : agentUsername};
    const safilter = {username : req.session.username};
    const aupdate = {$inc : {fundsUSD : superAgentFunds}};
    const note = req.body.noteUSD || '';

    console.log(agentUsername , superAgentFunds , note);
    Account.findOneAndUpdate(filter , aupdate ,(err , doc) =>{
        if(err) return res.json({error : 'error' , err});
        else{
            addTransaction('Deposit',req.session.username , agentUsername , superAgentFunds , note , 'USD');
            return res.json({success : 'successs'})   
        }
    });

}
depositLBPFundsToSuperAgent = (req,res) =>{

    let agentUsername = req.body.accountLBP ;
    let superAgentFunds = req.body.fundsLBP;
    const filter = {username : agentUsername};
    const safilter = {username : req.session.username};
    const aupdate = {$inc : {fundsLBP : superAgentFunds}};
    const note = req.body.noteLBP || '';

    console.log(agentUsername , superAgentFunds , note);
    Account.findOneAndUpdate(filter , aupdate ,(err , doc) =>{
        if(err) return res.json({error : 'error' , err});
        else{
            addTransaction('Deposit',req.session.username , agentUsername , superAgentFunds , note , 'LBP');
            return res.json({success : 'successs'})   
        }
    });

}
withdrawUSDFundsFromSuperAgent = (req,res) =>{
    console.log(req.body.accountUSD);
    let agentUsername = req.body.accountUSD ;
    let superAgentFunds = parseInt(req.body.fundsUSD);
    const filter = {username : agentUsername};
    const aupdate = {$inc : {fundsUSD : -superAgentFunds}};
    const note = req.body.noteUSD || '';
    Account.findOne({username : agentUsername},'fundsUSD' , (err , doc) =>{
        if(err) console.log(err);
        if(doc.fundsUSD < superAgentFunds){
            return res.json({insufficientFunds : `${agentUsername} does not have sufficient funds`})
        } 
        else{
    
            Account.findOneAndUpdate(filter , aupdate ,(err , doc) =>{
                if(err){
                    console.log(err);
                    return res.json({error : 'error' , err});
                } 
                else{
                    addTransaction('Withdraw',req.session.username , agentUsername , superAgentFunds , note , 'USD');
                    return res.json({success : 'successs'})   
                }
            });
        }
    })
    

}
withdrawLBPFundsFromSuperAgent = (req,res) =>{

    let agentUsername = req.body.accountLBP ;
    let superAgentFunds = req.body.fundsLBP;
    const filter = {username : agentUsername};
    const aupdate = {$inc : {fundsLBP : -superAgentFunds}};
    const note = req.body.noteLBP || '';
    let stopScript = false;
    Account.findOne({username : agentUsername},'fundsLBP' , (err , doc) =>{
        if(err) console.log(err);        
        if(doc.fundsLBP < superAgentFunds){
            return res.json({insufficientFunds : `${agentUsername} does not have sufficient funds`})
        }
        else{
            Account.findOneAndUpdate(filter , aupdate ,(err , doc) =>{
                if(err) return res.json({error : 'error' , err});
                else{
                    addTransaction('Withdraw',req.session.username , agentUsername , superAgentFunds , note , 'LBP');
                    return res.json({success : 'successs'})   
                }
            });
        }
    })
    


    
}


module.exports = {
    depositUSDFundsToSuperAgent,
    depositLBPFundsToSuperAgent,
    withdrawLBPFundsFromSuperAgent,
    withdrawUSDFundsFromSuperAgent
}