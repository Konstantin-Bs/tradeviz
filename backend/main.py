from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import stocks
from routers import websocket
from services.websocket_service import websocket_connect
from contextlib import asynccontextmanager
import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
  asyncio.create_task(websocket_connect())
  yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173", "https://gettradeviz.vercel.app"],
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(stocks.router)
app.include_router(websocket.router)

@app.get("/")
def root():
  return {"message": "tradeviz api is running"}