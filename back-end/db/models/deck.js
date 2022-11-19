const mongoose = require('mongoose');
const Schema = mongoose.Schema

const deckSchema = new Schema({
    name: String, 
    about: String,
    edit: Boolean, 
    creator: String,
	cards: []
}); 

const Deck = mongoose.model('Deck', deckSchema); 
module.exports = Deck; 