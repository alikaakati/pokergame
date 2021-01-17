const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transaction = new Schema({
    Type : String,
    From : String,
    To : String,
    Amount : Number,
    Note : String,
    Currency : String,
    time : { type : Date, default: Date.now }
});

const Transactions =  mongoose.model('Transaction',transaction);
module.exports = Transactions;