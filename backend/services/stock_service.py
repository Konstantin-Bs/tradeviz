import os 
from dotenv import load_dotenv
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockSnapshotRequest
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
from datetime import datetime, timedelta
import pandas as pd
from models.constants import TICKERS, COMPANY_NAMES

load_dotenv()

client = StockHistoricalDataClient(
  api_key=os.getenv("ALPACA_API_KEY"),
  secret_key=os.getenv("ALPACA_SECRET_KEY")
)

def get_stock_list():
  request = StockSnapshotRequest(
    symbol_or_symbols=TICKERS,
    feed="iex"
  )
  snapshots = client.get_stock_snapshot(request)

  snapshot_list = []

  for snapshot in snapshots:
    snapshot_list.append({
      "ticker": snapshot,
      "price": snapshots[snapshot].latest_trade.price,
      "prev_close": round(snapshots[snapshot].previous_daily_bar.close, 2),
      "volume": snapshots[snapshot].daily_bar.volume,
      "company_name": COMPANY_NAMES[snapshot]
    })
  return snapshot_list

def get_stock_bars(ticker: str, period:str):
  perioddict = {
    "1D": (TimeFrame.Minute, timedelta(days=1)),
    "1W": (TimeFrame.Hour, timedelta(days=7)),
    "1M": (TimeFrame.Day, timedelta(days=30)),
    "3M": (TimeFrame.Day, timedelta(days=90)),
    "1Y": (TimeFrame.Day, timedelta(days=365)),
    "5Y": (TimeFrame.Week, timedelta(days=1825))
  }
  timeframe, delta = perioddict[period]

  request = StockBarsRequest(
    symbol_or_symbols=ticker,
    timeframe=timeframe,
    start=datetime.now() - delta,
    end=datetime.now(),
    feed="iex"
  )
  bars = client.get_stock_bars(request)

  bars_list = []

  for bar in bars.data[ticker]:
    bars_list.append({
      "time": int(bar.timestamp.timestamp()),
      "open": bar.open,
      "high": bar.high,
      "low": bar.low,
      "close": bar.close,
      "volume": bar.volume
    })

  moving_average = pd.Series([bar["close"] for bar in bars_list]).rolling(20).mean()

  for i, value in enumerate(moving_average):
    if pd.isna(value):
      bars_list[i]["ma"] = None
    else:
      bars_list[i]["ma"] = round(value, 2)

  close_prices = [bar["close"] for bar in bars_list]

  return {
    "bars": bars_list,
    "week52_high": max(close_prices),
    "week52_low": min(close_prices)
  }