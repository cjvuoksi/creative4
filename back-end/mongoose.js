const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

async function main() {
    await mongoose.connect(`mongodb://127.0.0.1:27017/db-name`);
    
    const profile1 = new mongoose.Schema({
        name: String,
    });
    const profile2 = new mongoose.Schema({
        name: String,
    });
}