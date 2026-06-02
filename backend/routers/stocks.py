from fastapi import APIRouter
from services.stock_service import get_stock_list
from services.stock_service import get_stock_bars

router = APIRouter()

@router.get("/stocks")
def get_stocks():
  stock_list = get_stock_list()
  return stock_list

@router.get("/bars/{ticker}")
def get_bars(ticker: str):
  bars_list = get_stock_bars(ticker, "1M")
  return bars_list