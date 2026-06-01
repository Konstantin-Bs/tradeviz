import os 
from dotenv import load_dotenv
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockLatestQuoteRequest

load_dotenv()

client = StockHistoricalDataClient(
  api_key=os.getenv("ALPACA_API_KEY"),
  secret_key=os.getenv("ALPACA_SECRET_KEY")
)

TICKERS = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN"]

def get_stock_list():
  request = StockLatestQuoteRequest(
    symbol_or_symbols=TICKERS,
    feed="iex"
  )
  quotes = client.get_stock_latest_quote(request)

  quote_list = []

  for quote in quotes:
    calculated_price = round((quotes[quote].ask_price + quotes[quote].bid_price) / 2, 2)
    quote_list.append({
      "ticker": quote,
      "price": calculated_price,
      "timestamp": quotes[quote].timestamp
    })
  return quote_list