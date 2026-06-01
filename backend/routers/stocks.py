from fastapi import APIRouter
from services.stock_service import get_stock_list

router = APIRouter()

@router.get("/stocks")
def get_stocks():
  stock_list = get_stock_list()
  return stock_list