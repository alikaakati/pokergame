const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const tableSchema = new Schema({
    Name : String,
    MaxCapacity : Number,
    MinStake : Number,
    Rake : Number,
    PlayersInTable : { type : Array , "default" : []}
});

const Table =  mongoose.model('Table',tableSchema);
module.exports = Table;