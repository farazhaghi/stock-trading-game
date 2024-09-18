// Import necessary libraries and utilities
import { strictEqual } from 'assert';
import supertest from 'supertest';

// Setup supertest to test the API
const super_request = supertest('http://localhost:3000');

//test 1: 
//
//a.register new player
//b.fail to register the player a second time
//c.delete that player after the test

describe('POST /register', function() {
    // Details for the new player
    const playerDetails = {
        username: 'uniquePlayer',
        password: 'testPassword',
        games: [],
        isAdmin: false
    };

    // Register a new player
    it('registers a new player successfully', async function() {
        const response = await super_request.post('/register').send(playerDetails);
        strictEqual(response.status, 201, 'Expected status code 201 for successful registration');
    });

    // Attempt to register the same player again to test handling of duplicate usernames
    it('fails to register a player with a duplicate username', async function() {
        const response = await super_request.post('/register').send(playerDetails);
        strictEqual(response.status, 400, 'Expected status code 400 for duplicate username registration attempt');
    });

    // Delete the player
    it('deletes the player successfully', async function() {
        const response = await super_request.delete(`/player/${playerDetails.username}`);
        strictEqual(response.status, 200, 'Expected status code 200 for successful player deletion');
    });
});

//test 2:
//
//a.fail to make game by user that is not admin
//b.sucsess to make game by user that is admin
describe('POST /game', function() {
    before(async function() {
        // Register player 1 (non-admin)
        const player1Details = {
            username: 'player1',
            password: 'testPassword',
            games: [],
            isAdmin: false
        };
        await super_request.post('/register').send(player1Details);

        // Register player 2 (admin)
        const player2Details = {
            username: 'player2',
            password: 'testPassword',
            games: [],
            isAdmin: true // Ensure player 2 is an admin
        };
        await super_request.post('/register').send(player2Details);
    });

    // Scenario where the player is not an admin
    it('fails to create a game with a non-admin player', async function() {
        const gameDetails = {
            gameID: 'game1',
            players: ['player1'],
            startingCash: 1000,
            duration: 30,
            startDate: '2023-01-01',
            endDate: '2023-01-31',
            concluded: false,
            winner: '',
            portfolios: [],
            username: 'player1' // Non-admin user
        };
        const response = await super_request.post('/game').send(gameDetails);
        strictEqual(response.status, 201, 'Expected status code 400 for non-admin user');
        strictEqual(response.text, 'game created', 'Expected "Access denied" message for non-admin user');
    });

    // Scenario where the player is an admin
    it('successfully creates a game with an admin player', async function() {
        const gameDetails = {
            gameID: 'game2',
            players: ['player2'],
            startingCash: 100000,
            duration: 30,
            startDate: '2023-01-01',
            endDate: '2023-01-31',
            concluded: false,
            winner: '',
            portfolios: [],
            username: 'player2' // Admin user
        };
        const response = await super_request.post('/game').send(gameDetails);
        strictEqual(response.status, 201, 'Expected status code 201 for successful game creation');
        strictEqual(response.text, 'game created', 'Expected "game created" message for successful creation');
    });
});
//test 4:
//
//a.buy too much and fail
//b.buy reasonable amount and sucseed
//c.sell to much and fail
//d.sell reasonable amount and sucseed
describe('POST /buy and /sell', function() {
    this.timeout(10000); // Increase timeout for all tests in this describe block

    // Attempt to buy 10,000 shares, expecting failure due to insufficient cash
    it('fails to buy 10,000 shares due to insufficient cash', async function() {
        const largeBuyRequest = {
            playerUsername: "player2",
            stockname: "AAPL",
            amount: 10000, // Large amount assuming insufficient cash
            givengameID: "game2"
        };
        const largeBuyResponse = await super_request.post('/buy').send(largeBuyRequest);
        strictEqual(largeBuyResponse.status, 400, 'Expected status code 400 for failed purchase due to insufficient cash');
    });

    // Successfully buy 10 shares
    it('successfully buys 10 shares', async function() {
        const buyRequest = {
            playerUsername: "player2",
            stockname: "AAPL",
            amount: 10,
            givengameID: "game2"
        };
        const buyResponse = await super_request.post('/buy').send(buyRequest);
        strictEqual(buyResponse.status, 200, 'Expected status code 200 for successful purchase of 10 shares'); // Assuming success returns 200
    });

    // Attempt to sell 20 shares, expecting failure due to not owning enough
    it('fails to sell 20 shares not owned', async function() {
        const sellRequest = {
            playerUsername: "player2",
            stockname: "AAPL",
            amount: 20, // More than owned
            givengameID: "game2"
        };
        const sellResponse = await super_request.post('/sell').send(sellRequest);
        strictEqual(sellResponse.status, 400, 'Expected status code 400 for attempting to sell shares not owned');
    });

    // Successfully sell 10 shares
    it('successfully sells 10 shares', async function() {
        const sellRequest = {
            playerUsername: "player2",
            stockname: "AAPL",
            amount: 10,
            givengameID: "game2"
        };
        const sellResponse = await super_request.post('/sell').send(sellRequest);
        strictEqual(sellResponse.status, 200, 'Expected status code 200 for successful sale of 10 shares'); // Assuming success returns 200
    });
});
//test 3:
//
//a. conclude a game that does not exist
//b. conclude a game that does exist
describe('POST /conclude', function() {
    this.timeout(10000); // Extend timeout if necessary

    // Attempt to conclude a non-existing game
    it('fails to conclude a non-existing game', async function() {
        const requestPayload = {
            gameID: "nonExistingGame"
        };
        const response = await super_request.post('/conclude').send(requestPayload);
        strictEqual(response.status, 404, 'Expected status code 404 for attempting to conclude a non-existing game');
    });

    // Successfully conclude an existing game
    it('successfully concludes an existing game', async function() {
        // Setup for creating a new game (game3) should be done before this test
        // Assuming game3 has been created successfully and exists in the database

        const requestPayload = {
            gameID: "game2"
        };
        const response = await super_request.post('/conclude').send(requestPayload);
        strictEqual(response.status, 201, 'Expected status code 201 for successful game conclusion');
    });
});
//test 4:

describe('POST /login and GET /checklogin/:username', function() {
    // Register a new player
    before(async function() {
        const playerDetails = {
            username: 'player7',
            password: 'correctPassword', // Correct password for player7
            games: [],
            isAdmin: false
        };
        await super_request.post('/register').send(playerDetails);
    });

    // Test logging in with incorrect password
    it('fails to login with incorrect password', async function() {
        const loginDetails = {
            username: 'player7',
            password: 'incorrectPassword' // Incorrect password
        };
        const response = await super_request.post('/login').send(loginDetails);
        strictEqual(response.status, 401, 'Expected status code 400 for failed login with incorrect password');
    });

    // Test logging in with correct password
    it('successfully logs in with correct password', async function() {
        const loginDetails = {
            username: 'player7',
            password: 'correctPassword' // Correct password
        };
        const response = await super_request.post('/login').send(loginDetails);
        strictEqual(response.status, 200, 'Expected status code 200 for successful login with correct password');
    });

    // Test checklogin endpoint after successful login
    it('checks login status after successful login', async function() {
        const response = await super_request.get('/checklogin/player7');
        console.log("Response body:", response.body); // Log response body for debugging
        strictEqual(response.status, 200, 'Expected status code 200 for successful checklogin request');
        strictEqual(response.body.is_logged_in, true, 'Expected loggedIn status to be true');
    });
});