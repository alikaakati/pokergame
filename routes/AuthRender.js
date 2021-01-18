const Account = require('../models/Account');
const Transactions = require('../models/Transaction');
const auth = require('../middleware/Authenticate');
const authModerator = auth.authModerator;

module.exports = (app) => {

    app.get('/',(req , res) =>{
        res.render('./login.ejs');
    });

    app.get('/login',(req , res) =>{
        res.render('./login.ejs');
    });

    app.get('/index',(req , res) =>{
        res.render('./login.ejs');
    })
    
        


}