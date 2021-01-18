const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const account = new Schema({
    username : String,
    password : String,
    level : String,
    refferal : String,
    superRefferal : String,
    fundsUSD : Number,
    fundsLBP : Number,
    rake : Number,
    phone : String,
    isSuspended : Boolean,
    token : String,
    time : { type : Date, default: Date.now }
});

const Account =  mongoose.model('Account',account);
module.exports = Account;