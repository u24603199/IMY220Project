const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://test-user:test-password@imy220.wmeo6pg.mongodb.net/?retryWrites=true&w=majority&appName=IMY220";
const connect = new MongoClient(uri);

let db;

async function connectToDatabase(){
    if (db) return db;
    try{
        await connect.connect();
        db = connect.db("CFlare");
        return db;
    }catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
    // finally {
    //     await connect.close();
    // }
}

module.exports = connectToDatabase;