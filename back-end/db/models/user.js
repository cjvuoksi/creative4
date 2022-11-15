const mongoose = require('mongoose');

const Schema = mongoose.Schema
const userSchema = new Schema({
	uid: String,
    decks: [ Schema.Types.ObjectID ]
})

const User = mongoose.model('User', userSchema)
module.exports = User