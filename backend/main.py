from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import stocks
from routers import websocket

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173"],
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(stocks.router)
app.include_router(websocket.router)

@app.get("/")
def root():
  return {"message": "tradeviz api is running"}