//imports
import { getDb } from '../utils/DB.mjs';
// Retrieves the 'players' collection from the database
async function _get_players_collection() {let db = await getDb();return db.collection('players');};
// Defines the Player class for managing player data
class Player {
    constructor(username, password, games, isAdmin, is_logged_in) {
        this.username = username;
        this.password = password;
        //ID of game player is part of
        this.games = games;
        //to see if certain parts render for the player in part 3 of the project and also gives game making permissions
        this.isAdmin = isAdmin;
        this.is_logged_in = false;
    }
    // Retrieves a player by username
    static async get(username) {
        let collection = await _get_players_collection();
        return collection.find({ "username": username }).toArray();
    }
    // Retrieves all players from the database
    static async getAll() {
        let collection = await _get_players_collection();
        return collection.find({}).toArray();               
    }
    // Adds a new player to the database
        static async add(username, password, games, isAdmin, is_logged_in) {
        let collection = await _get_players_collection();
        // Check if the player already exists
        const existingPlayer = await collection.findOne({ "username": username });
        if (existingPlayer) {
            console.log('Player already exists in DB');
            return 400; // Player exists, return "400" Bad Request
        } else {
            await collection.insertOne({ username, password, games, isAdmin, is_logged_in : false });
            console.log('Player registered in DB');
            return 201; // Player added, return "201" Created
        }
    }
        // Adds a method to delete a player by username
    static async delete(username) {
        let collection = await _get_players_collection();
        const deletionResult = await collection.deleteOne({ "username": username });
        if (deletionResult.deletedCount === 0) {
            console.log('No player found with the given username');
            return 404; // Not Found
        } else {
            console.log('Player deleted from DB');
            return 200; // OK
        }
    }
    // Log in a player
static async login(username, password) {
    let collection = await _get_players_collection();
    const player = await collection.findOne({ username: username, password: password });
    if (player) {
        await collection.updateOne({ username: username }, { $set: { is_logged_in: true } });
        console.log(`${username} logged in successfully`);
        return true;
    } else {
        console.log('Login failed');
        return false;
    }
}

// Check if a player is logged in
static async checkLogin(username) {
    let collection = await _get_players_collection();
    const player = await collection.findOne({ username: username });
    return player ? player.is_logged_in : false;
}
// Logs out all players
static async logoutAll() {
    let collection = await _get_players_collection();
    const result = await collection.updateMany({}, { $set: { is_logged_in: false } });
    console.log(`Logged out ${result.modifiedCount} player(s).`);
    return result.modifiedCount;  // Returns the count of modified documents
}
}
export { Player };
