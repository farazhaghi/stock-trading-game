//Imports
//database
import {connectToDB, closeDBConnection} from './utils/DB.mjs';
//player
import {list_all_players, get_player, add_player, delete_player, login_player, check_login, disconnect_all_players} from './controller/player.js';
//game
import {create_game, buyStock, sellStock, conclude_game, get_game, list_all_games} from './controller/game.js';
//express
import express, { json, urlencoded } from 'express';
// Initialize express app
const app = express();
const port = 3000;
let server; // Server variable to be defined upon server creation
// Middleware to parse JSON and URL-encoded data
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static('public'));
// Function to create and configure the server
async function createServer() {
    // Connect to the database    
    await connectToDB(); 
    //for internal use
    app.get('/player/:name', get_player);
    app.get('/player', list_all_players);
    app.delete('/player/:username', delete_player);
    //route handlers
    app.post('/login', login_player);
    app.get('/checklogin/:username', check_login);
    app.post('/register', add_player);
    app.post('/game', create_game);
    app.post('/buy', buyStock);
    app.post('/sell', sellStock);
    app.post('/conclude', conclude_game)
    app.post('/disconnect', disconnect_all_players);
    // Retrieve a specific game by gameID
    app.get('/game/:gameID', get_game);
    // List all games
    app.get('/games', list_all_games);
    // Start the server and listen
    server = app.listen(port, () => {console.log(`listening at http://localhost:${port}`);});
}
createServer(); // Call the function to create and start the server to listen
// Handle SIGINT for graceful shutdown
process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    console.log('Closing Mongo Client.');
    if (server) {
        server.close(async function () {await closeDBConnection();console.log("exited");});
    }
});
