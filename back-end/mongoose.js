const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
import User from "./db/user";
import Deck from "./db/deck"; 


async function main() {
    await mongoose.connect(`mongodb://127.0.0.1:27017/`);
    
    const user = new mongoose.Schema({
        name: String,
    });
    
    const profile2 = new mongoose.Schema({
        name: String,
    });
}
