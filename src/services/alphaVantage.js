const API_KEY = 'demo';
export async function fetchStockQuote(symbol) {
  const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
  return response.json();
}