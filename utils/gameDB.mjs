//imports
import { getDb } from './DB.mjs';
// Fetches game details by ID from the 'game' collection.
async function getGameDetails(gameId) {
    const collection = await getGamesCollection(); 
    return await collection.findOne({ _id: gameId });
}
// Retrieves the 'game' collection from the database.
async function getGamesCollection() {
    const db = await getDb(); 
    return db.collection('game'); 
}
export { getGameDetails };
