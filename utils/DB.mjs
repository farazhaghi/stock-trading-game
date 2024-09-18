//imports
import { MongoClient } from 'mongodb';
// MongoDB connection string
const uri = "mongodb://localhost:27017";
// Create a MongoClient with unified topology option
const client = new MongoClient(uri, { useUnifiedTopology: true });
// Database instance
var db;
// Connect to MongoDB 
export async function connectToDB() {
    await client.connect(); 
    db = await client.db('stockgame'); 
    console.log("mongoDB Connection successful");  
}
// Retrieve database instance
export async function getDb() {
    return db;
}
// Close database
export async function closeDBConnection(){
    await client.close(); 
    return 'Connection closed'; 
};
// Export functions as a module
export default { connectToDB, getDb, closeDBConnection };
