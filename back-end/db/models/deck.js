const mongoose = require('mongoose');
const Schema = mongoose.Schema

const deckSchema = new Schema({
    name: String, 
    visible: Boolean, 
	cards: [{term: String, definition: String}]
}); 

const Deck = mongoose.model('Deck', deckSchema); 
module.exports = Deck; 