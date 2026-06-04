import websockets
from dotenv import load_dotenv
import os
import json
from fastapi import WebSocket
from models.constants import TICKERS

load_dotenv()

KEY_ID = os.getenv("ALPACA_API_KEY")
SECRET = os.getenv("ALPACA_SECRET_KEY")

ws_url = "wss://stream.data.alpaca.markets/v2/iex"

async def websocket_connect(websocket: WebSocket):
  ws = await websockets.connect(ws_url)
  welcome = await ws.recv()
  print(welcome)
  await ws.send(json.dumps({"action": "auth", "key": f"{KEY_ID}", "secret": f"{SECRET}"}))
  auth = await ws.recv()
  print(auth)
  await ws.send(json.dumps({"action": "subscribe", "trades": TICKERS}))
  async for message in ws:
    await websocket.send_text(message)
    print(message)