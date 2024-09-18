# Project Name

Stock trading game

## Repository Structure

- `/controllers`: Contains the controller functions for the application, specifically `game.js` and `player.js`, which manage game and player interactions respectively.
- `/models`: Includes the model definitions for our application, `game.mjs` for game data structure, and `player.mjs` for player data structure.
- `/utils`: This folder houses utility files such as `DB.mjs` for MongoDB database creation and connection setup, `gameDB.mjs` for database operations specific to game data, and `price_req.mjs` for fetching stock prices used in the game. The API key for fetching stock prices was provided by a friend.

## JavaScript Architecture

The main server file is `app.js`, which utilizes Express.js for routing and managing HTTP requests. It incorporates controller functions defined in `game.js` and `player.js` for handling game and player logic, respectively. The models defined in `/models` folder are used for structuring game and player data. Utilities like database connection and external API requests are managed in the `/utils` folder.

## API/HTTP Requests

### Player Management

- `POST /login` - Logs in a player.
  - **Example**:
    - **Request**: `http://localhost:3000/login`
    - **Body**: `{"username": "player1", "password": "pass1234"}`

- `GET /checklogin/:username` - Checks if a player is logged in.
  - **Example**:
    - **Request**: `http://localhost:3000/checklogin/player1`

- `GET /player/:name` - Retrieves a specific player by name.
  - **Example**:
    - **Request**: `http://localhost:3000/player/player1`

- `GET /player` - Lists all registered players.
  - **Example**:
    - **Request**: `http://localhost:3000/player`

- `DELETE /player/:username` - Deletes a player based on the username.
  - **Example**:
    - **Request**: `http://localhost:3000/player/uniquePlayer`

- `POST /register` - Registers a new player to the game.
  - **Example**:
    - **Request**: `http://localhost:3000/register`
    - **Body**: `{"username": "player1", "password": "pass1234", "games": [], "isAdmin": true}`

- `POST /disconnect` - Logs out all players.
  - **Example**:
    - **Request**: `http://localhost:3000/disconnect`

### Game Management

- `POST /game` - Creates a new game session.
  - **Example**:
    - **Request**: `http://localhost:3000/game`
    - **Body**: `{"gameID": "game1", "players": ["player2"], "startingCash": 100000, "duration": 30, "startDate": "2023-01-01", "endDate": "2023-01-31", "concluded": false, "winner": "", "portfolios": [], "username": "player2"}`

- `GET /game/:gameID` - Retrieves details of a specific game by gameID.
  - **Example**:
    - **Request**: `http://localhost:3000/game/game1`

- `GET /games` - Lists all games.
  - **Example**:
    - **Request**: `http://localhost:3000/games`

- `POST /buy` - Handles the buying of stock within a game session.
  - **Example**:
    - **Request**: `http://localhost:3000/buy`
    - **Body**: `{"playerUsername": "player2", "stockname": "AAPL", "amount": 10, "givengameID": "game2"}`

- `POST /sell` - Handles the selling of stock within a game session.
  - **Example**:
    - **Request**: `http://localhost:3000/sell`
    - **Body**: `{"playerUsername": "player2", "stockname": "AAPL", "amount": 10, "givengameID": "game2"}`

- `POST /conclude` - Concludes a game session.
  - **Example**:
    - **Request**: `http://localhost:3000/conclude`
    - **Body**: `{"gameID": "game2"}`

## Setup and Running

### Pre-requisites

- Node.js
- MongoDB
- Express
- Mocha and Supertest for testing

### Setup

1. Ensure MongoDB is installed and running on your system.
2. Clone this repository and navigate into the project directory.
3. Install necessary npm packages by running `npm install`.

### Running the Server

1. Open a terminal and run `node app.js` to start the server.
2. In a separate terminal, run `npm test` to execute the test suite.

### Database Setup

A mongoDB connection is needed. (mongodb://localhost:27017) and then the databases name is "stockgame". it conssits of two collections, game and players.

## Testing

To run the unit tests, execute `npm test` in the terminal. The test suite includes tests for each API endpoint and utility function. Please note that all tests are currently passing, but future updates or changes to the codebase may require additional tests or modifications to existing ones.

## Part 3: Frontend Integration and Additional API Requests

In this update, significant enhancements have been made to the project to better accommodate frontend requirements and improve user interaction. Additionally, new API requests have been implemented to support these changes.

### Updated API Requests

Several new API requests have been added to enhance frontend functionality. Please refer to the updated documentation in Part 2 for details on these additions.

### Frontend Development

The project now includes a three-page frontend built using HTML and a touch of CSS for styling. These pages are:

1. **Login Page:** Allows players to log in or register if they are not already in the database.
2. **Main Page:** Provides functionality for administrators to create games, players to join games, and facilitates the management of ongoing games, including concluding them. It also displays a list of games along with the players participating for convenience.
3. **Game Page:** Displays the player's portfolio and a brief overview of other players' portfolios. It also allows players to buy and sell stocks within the game.

### Updated Unit Tests

Unit tests have been updated to accommodate the new API requests and frontend features, ensuring robustness and reliability throughout the project.

### Explanation Video

For a detailed explanation of the project updates and frontend integration, please refer to the following video: [Link to Explanation Video](https://drive.google.com/file/d/1buF8K2_yvNxMx2kh-ygGZux4aWmnOr06/view?usp=drive_link)

Feel free to explore the updated project and its features. If you encounter any issues or have suggestions for further improvements, don't hesitate to reach out.



