//imports
import { getDb } from '../utils/DB.mjs';
import { Game } from '../model/game.mjs';
import { Player } from '../model/player.mjs';
import { fetchStockPrice } from '../utils/price_req.mjs';
// Retrieves the 'game' collection from the database
async function _get_game_collection() {let db = await getDb();return db.collection('game');}
// Retrieves game details
export async function get(req, res) {
    const { gameID } = req.body;
    let game = await Game.get(gameID);
    res.send(game || 'No game was found');
}
// Creates a new game with provided details
export async function create_game(req, res) {
    const { gameID, players, startingCash, duration, startDate, endDate, concluded, winner, portfolios, username } = req.body;
    const playerInfo = await Player.get(username);
    //error handling
    if(!playerInfo.length > 0){res.status(400).send('player not found');}
    else if(!playerInfo[0].isAdmin){res.status(400).send('Access denied');}
    //sucsess scenario
    else{
        await (new Game(gameID, players, startingCash, duration, startDate, endDate, concluded, winner, portfolios)).create();
        res.status(201).send('game created');
    }
}
//buy stock for a player
export async function buyStock(req, res){
    const { playerUsername, stockname, amount, givengameID } = req.body;
    //find the given game based on ID
    const game = await Game.get(givengameID);
    // Find the player in portfolios list dynamically based on playerUsername
    const targetplayerportfolio = game.portfolios.find(player => player.playerUsername === playerUsername);
    //find the price of the requested transaction
    const price = ((await fetchStockPrice()).find(stock => stock.symbol === stockname).price)* amount * 1.01;
    //error handling
    if (!targetplayerportfolio) {res.status(400).send('player not found');}
    else if (targetplayerportfolio.cash < price) {res.status(400).send('"player does not have enough cash"');}
    //sucsses scenario
    else{
        //doing the purchase
        const existingStock = targetplayerportfolio.stocks.find(stock => stock.stockname === stockname);
        if(existingStock){existingStock.amount += amount;}
        else{targetplayerportfolio.stocks.push({ stockname: stockname, amount: amount });}
        targetplayerportfolio.cash = targetplayerportfolio.cash - price; 
        //updating database
        await Game.updateGameDetails(playerUsername, givengameID ,targetplayerportfolio.stocks, targetplayerportfolio.cash);
        res.status(200).send('purchase made');
    }
}
//sell stock for a player
export async function sellStock(req, res) {
    const { playerUsername, stockname, amount, givengameID } = req.body;
    //find the given game based on ID
    const game = await Game.get(givengameID);
    // Find the player in portfolios list dynamically based on playerUsername
    const targetplayerportfolio = game.portfolios.find(player => player.playerUsername === playerUsername);
    const targetstockIndex = targetplayerportfolio.stocks.findIndex(stock => stock.stockname === stockname);
    //find the price of the requested transaction
    const stock = (await fetchStockPrice()).find(stock => stock.symbol === stockname);
    const price = stock.price * amount * 0.99;
    //find the stock in the players portfolio
    const targetstcok = targetplayerportfolio.stocks.find(stock => stock.stockname === stockname);
    //error handling
    if (!targetplayerportfolio) {res.status(400).send('player not found');}  
    else if (!targetstcok){res.status(400).send('player does not own this stock');}
    else if (amount>targetstcok.amount){res.status(400).send('player does not own enough of this stock');}
    //sucsses scenario
    else {
        //doing the sale
        targetstcok.amount -= amount;targetplayerportfolio.cash += price;
        //delete from portfolio if player now has none
        if (targetstcok.amount === 0) {targetplayerportfolio.stocks.splice(targetstockIndex, 1);}
        //update database
        await Game.updateGameDetails(playerUsername, givengameID ,targetplayerportfolio.stocks, targetplayerportfolio.cash);    
        res.status(200).send('sale made');
    }
}
//conclude (delete) a game based on its ID
export async function conclude_game(req, res) {
    const { gameID } = req.body;
    let db = await getDb();
    const collection = await db.collection('game');
    // Check if the game exists
    const gameExists = await collection.findOne({ gameID: gameID });
    if (!gameExists) { res.status(404).send('Game not found');} 
    else {
        // Find the player with the highest cash amount
        let winner = gameExists.portfolios.reduce((acc, player)=>{return(acc === null||player.cash > acc.cash) ? player : acc;},null);
        // Log the winner's username to the console
        if(winner) {console.log(`Winner: ${winner.playerUsername} with cash: ${winner.cash}`);} 
        else {console.log("No winner found or no players in game.");}
        //delete the game
        await collection.deleteOne({ gameID: gameID });
        res.status(201).send('Game concluded');
    }
}
// Retrieves details of a specific game by gameID
export async function get_game(req, res) {
    const gameID = req.params.gameID; // Assuming you're using URL parameters
    let game = await Game.get(gameID);
    if (game) {
        res.status(200).send(game);
    } else {
        res.status(404).send('No game found with the given ID');
    }
}

// Lists all games
export async function list_all_games(req, res) {
    let games = await Game.getAll();
    if (games.length > 0) {
        res.status(200).send(games);
    } else {
        res.status(404).send('No games found');
    }
}

