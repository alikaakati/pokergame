// each player needs to add to the jackport 
// if the user checks we pass the turn to the next player
// if we hit we need to inform all the others that they have to hit or they are out
const Hands = require('../models/Hand');



createHand = () =>{
    let newHand = new Hands();
    newHand.save((err , doc) =>{
        return doc.id;
    });
    return 0;

}
userChecks = (handID , username ) =>{
    // we need to update a field in the database that indicates that the user turn has been changed
    // we update the active user field in the hand db by changing the username that is contained inside of it
 //   Hands.find
    

    
    
}

module.exports = {
    createHand , 
    userChecks
}