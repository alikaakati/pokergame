
const Account = require("../models/Account");


authenticateAgent = (req,res,next) =>{

    if(req.session.username && req.session.isLoggedIn && req.session.level == 'agent') next()
    else res.json({msg : "error"})
}

authenticateSuperAgent = (req,res,next) =>{

    if(req.session.username  && req.session.isLoggedIn && req.session.level == 'superagent') next()
    else res.json({msg : "error" + req.session})
}

authenticateModerator = (req,res,next) =>{

    if(req.session.username  && req.session.isLoggedIn && req.session.level == 'moderator') next()
    else res.json({msg : "error" + req.session})
}

authenticateUser = (req , res , next) =>{
    let filter = {username : req.body.username , token : req.body.token};
    Account.find(filter , (err , doc) =>{
        if(err) return res.json({error : 'error'});
        else next();
    })
}

module.exports = {
    authenticateAgent,
    authenticateSuperAgent,
    authenticateModerator,
    authenticateUser
};