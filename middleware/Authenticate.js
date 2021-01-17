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

module.exports = {
    authenticateAgent,
    authenticateSuperAgent,
    authenticateModerator
};