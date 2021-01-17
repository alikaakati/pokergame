const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hands = new Schema({

    players : [{}],
    jackport : Number,
    activePlayer : String
    


});

const Hands =  mongoose.model('Hands',hands);
module.exports = Hands;

/*

    We first need to save the players array containing each player username and his cards 
    We need to save the jackpot
    we need to save the winner's username and highest card



*/