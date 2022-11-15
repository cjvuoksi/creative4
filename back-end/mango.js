const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
import User from "./db/user";
import Deck from "./db/deck"; 


async function main() {
    await mongoose.connect(`mongodb://127.0.0.1:27017/`);
    
    
}
