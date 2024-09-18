// Import the axios library for making HTTP requests.
import axios from 'axios';
// Fetches stock price information from a financial API.
export async function fetchStockPrice() {
    const apiKey = 'ZP4LORPsLEgpALYFHOgzcwH8WxJ7unJj';
    const apiUrl = `https://financialmodelingprep.com/api/v3/stock/list?apikey=${apiKey}`;
    const res = await axios.get(apiUrl); 
    return res.data;
}
// Export the fetchStockPrice function as a default export.
export default {fetchStockPrice};
