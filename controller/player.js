import { Player } from '../model/player.mjs';
// Retrieves a player by username
export async function get_player(req, res) {
    let username_to_match = req.params.username;
    let player = await Player.get(username_to_match);
    if (player.length > 0){console.log(`${player.length} player info retrieved`);res.send(player[0]);}
    else{res.send('palyer not in DB');}
}
// Lists all players in the database
export async function list_all_players(req, res) {    
    let players = await Player.getAll();
    console.log(`${players.length} player(s) sent.`);
    res.send(players);        
}
// Adds a player to the database
export async function add_player(req, res) {
    const { username, password, games, isAdmin } = req.body;
    const m = await Player.add(username, password, games, isAdmin);
    if (m ===400){res.status(m).send('player already in database'); }
    else {res.status(m).send('player registered'); }
    
}
export async function delete_player(req, res) {
    const username = req.params.username;
    const status = await Player.delete(username);
    if (status === 404) {
        res.status(404).send('Player not found');
    } else {
        res.status(200).send('Player deleted successfully');
    }
}
// Logs in a player if the username and password match
export async function login_player(req, res) {
    const { username, password } = req.body;
    const loggedIn = await Player.login(username, password);
    if (loggedIn) {
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid username or password');
    }
}

// Checks if a player is logged in
export async function check_login(req, res) {
    console.log("I was called !");
    const { username } = req.params;
    const isLoggedIn = await Player.checkLogin(username);
    console.log("I said");
    console.log(isLoggedIn);
    res.status(200).send({ is_logged_in: isLoggedIn });
}
// Logs out all players
export async function disconnect_all_players(req, res) {
    const loggedOutCount = await Player.logoutAll();
    if(loggedOutCount > 0) {
        res.status(200).send(`${loggedOutCount} player(s) logged out successfully.`);
    } else {
        res.status(200).send('No players were logged in.');
    }
}

