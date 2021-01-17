const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logs = new Schema({
    logType : String,
    logDescription : String,
    time : { type : Date, default: Date.now }
});

const Logs =  mongoose.model('Logs',logs);
module.exports = Logs;