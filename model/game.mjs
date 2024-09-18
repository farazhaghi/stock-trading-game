//imports
import { getDb } from '../utils/DB.mjs';
// Retrieves the 'game' collection from the database
async function _get_game_collection() {let db = await getDb();return db.collection('game');}
// Represents a game with participants, duration, and financial parameters
class Game {
    constructor(gameID, players, startingCash, duration, startDate, endDate, concluded, winner, portfolios) {
        this.gameID = gameID;
        this.players = players;
        this.startingCash = startingCash;
        this.duration = duration;
        this.startDate = startDate;
        this.endDate = endDate;
        this.concluded = concluded;
        this.winner = winner;
        this.portfolios = portfolios || [];
    }
    // Retrieves a game by its ID
    static async get(gameID) {
        let collection = await _get_game_collection();
        return collection.findOne({ "gameID": gameID });
    }
    // Initializes portfolios for each player with starting cash and an empty stock portfolio after game creation
    initializePortfolios(players, startingCash) {
        return players.map(username => ({playerUsername: username,cash: startingCash,stocks: []}));
    }
    // Creates a new game entry in the database
    async create() {
        let collection = await _get_game_collection();
        this.portfolios = this.initializePortfolios(this.players, this.startingCash);
        await collection.insertOne({gameID: this.gameID,players: this.players,startingCash: this.startingCash,
        duration: this.duration,startDate: this.startDate,endDate: this.endDate,
        concluded: this.concluded,winner: this.winner,portfolios: this.portfolios
        });
        console.log('Game created in DB');
        return '201';
    }
    // Updates specific game details for a player
    static async updateGameDetails(playerUsername, gameID, portfolios, cash) {
        const collection = await _get_game_collection();
        const filterCriteria = { 'gameID': gameID, 'portfolios.playerUsername': playerUsername };
        const update = {$set: {'portfolios.$.stocks': portfolios,'portfolios.$.cash': cash}};
        const result = await collection.updateOne(filterCriteria, update);
        return result.modifiedCount > 0 ? 'Game details updated successfully.' : 'Game details were not updated.';
    }
    // Retrieves all games from the database
static async getAll() {
    let collection = await _get_game_collection();
    return collection.find({}).toArray();
}

}
export { Game };
