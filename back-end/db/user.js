const mongoose = require('mongoose');
import Deck from "deck.js"; 
const Schema = mongoose.Schema
const userSchema = new Schema({
	uid: String,
    decks: [Deck]
})

const User = mongoose.model('User', userSchema)
module.exports = User