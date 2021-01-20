const Account = require('../models/Account');
const Table = require('../models/Tables');
const Logs = require('../models/Logs');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const Transactions = require('../models/Transaction');



// Uncommment only when you need to create a new moderator
/*
    // registerModerator = async() =>{
    //     let password = await bcrypt.hash('123123123',10);
    //     let newAccount = new Account({
    //         username : 'moderator',
    //         password : password,
    //         level : 'moderator',
    //         refferal : '',
    //         fundsUSD : 3000,
    //         fundsLBP : 3000,
    //         rake : 0,
    //         phone : '',
    //         isSuspended : 0
    //     });
    //     newAccount.save();
    //     res.json({added : 'done'})
    // }
*/


login = (req,res) =>{
    let filter = {username : req.body.username}
    Account.findOne(filter,(err , user)=>{
        if(!user) res.json({error : "No user found"})
        else{


            bcrypt.compare(req.body.password , user.password,(err , result) =>{
                if(err || result == false) res.json({error : "Passwords dont match !"})
                else{
                    req.session.userID = user._id;
                    req.session.username = req.body.username;
                    req.session.level = user.level;
                    req.session.fundsUSD = user.fundsUSD;
                    req.session.fundsLBP = user.fundsLBP;
                    req.session.rake = user.rake || 0;
                    req.session.refferal = user.refferal || '';
                    req.session.isLoggedIn = true;
                    console.log(req.session);

                    res.json({level : user.level})
                }
            })
        }
    })
}

registerAgent = (req,res) =>{

    Account.findOne({username : req.body.username} , (err , result) =>{
        if(result) return res.json({error : "Agent already registered"});
        else{

            bcrypt.hash(req.body.password , 10 , async(err , hash) =>{
                if(err) res.json({error : "an error occured"})
                if(hash){
                    let newAccount = new Account({
                        username : req.body.username,
                        password : hash,
                        level : 'agent',
                        refferal : req.session.username,
                        fundsLBP : req.body.fundsLBP,
                        fundsUSD : req.body.fundsUSD,
                        rake : req.body.rake,
                        phone : req.body.phone,
                        isSuspended : req.body.isSuspended,
                        
                    });
                    await newAccount.save();
                    const filter = {username : req.session.username};
                    const update = { $inc : { fundsUSD : -req.body.fundsUSD , fundsLBP : -req.body.fundsLBP}};
                    Account.findOneAndUpdate(filter , update , (err , doc) =>{
                        if(err) return res.json({error : err})
                        else return res.json({added : "added agent successfully !"})
                    });

                    
        
                }
            })
        }
    })
}
registerSuperAgent = async(req,res) =>{
    
    await Account.findOne({username : req.body.username} , (err , result) =>{
        if(result){
            return res.json({error : "User already registered"})
        }
        else{

            bcrypt.hash(req.body.password , 10 , (err , hash) =>{
                if(err) res.json({error : "an error occured"})
                if(hash){
                    let newAccount = new Account({
                        username : req.body.username,
                        password : hash,
                        level : 'superagent',
                        refferal : 'moderator',
                        fundsLBP : req.body.fundsLBP,
                        fundsUSD : req.body.fundsUSD,
                        rake : req.body.rake,
                        phone : req.body.phone,
                        isSuspended : req.body.isSuspended,
                    });
                    newAccount.save();
                    res.json({added : "added SuperAgent successfully !"})
        
                }
            })
        }
    })
}


checkIfLoggedIn = async(req,res) =>{

    let filter = {username : req.body.username , token : req.body.token};
    Account.findOne(filter , (err , doc) =>{
        if(doc) return res.json({success : 'success'});
        else{
            return res.json({error : 'error'});
        }
    });

}
registerUserByAgent = async(req,res) =>{

    Account.findOne({username : req.body.username} , (err , result) =>{
        if(result) return res.json({error : "User already registered"});
        else{

            bcrypt.hash(req.body.password , 10 , async(err , hash) =>{
                if(err) res.json({error : "an error occured"})
                if(hash){
                    let newAccount = new Account({
                        username : req.body.username,
                        password : hash,
                        level : 'user',
                        refferal : req.session.username,
                        superRefferal : req.session.refferal,
                        fundsLBP : req.body.fundsLBP,
                        fundsUSD : req.body.fundsUSD,
                        phone : req.body.phone,
                        isSuspended : req.body.isSuspended,
                        
                    });
                    await newAccount.save();
                    const filter = {username : req.session.username};
                    const update = { $inc : { fundsUSD : -req.body.fundsUSD , fundsLBP : -req.body.fundsLBP}};
                    Account.findOneAndUpdate(filter , update , (err , doc) =>{
                        if(err) return res.json({error : err})
                        else return res.json({added : "added player successfully !"})
                    });

                    
        
                }
            })
        }
    })






}




userLogin = async(req , res) =>{
    let filter = {username : req.body.username}
    let username = req.body.username;
    let password = req.body.password;
    let loginDate = new Date().toLocaleString();


    Account.findOne(filter,(err , user)=>{
        if(!user) res.json({error : "Invalid username or password"})
        else{


            bcrypt.compare(req.body.password , user.password,async(err , result) =>{
                if(err || result == false) return res.json({error : "Invalid username or password !"})
                else{
                    let token = username + '' + password + '' +loginDate;
                    let tokenHash = await bcrypt.hash(token , 10);
                    user.token = tokenHash;
                    await user.save();
                    return res.json({success : tokenHash});
                }
            })
        }
    })
}


userGetTables = async(req , res) =>{

    let tableType = req.body.tableType;
    let tableCurrency = req.body.tableCurrency;
    let filter = { tableType : tableType , tableCurrency : tableCurrency};
    await Table.find(filter , (err , doc) =>{
        if(err) return res.json({error : 'error'});
        else{
            return res.json({doc});

        }
    })
}




module.exports = {
    login,
    registerAgent,
    registerSuperAgent,
    registerUserByAgent,
    userLogin,
    checkIfLoggedIn,
    userGetTables
}