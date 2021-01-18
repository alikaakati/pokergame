const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const tableSchema = new Schema({
    Name : String,
    TableType : String,
    MaxCapacity : Number,
    MinStake : Number,
    Rake : Number,
    
});

const Table =  mongoose.model('Table',tableSchema);
module.exports = Table;