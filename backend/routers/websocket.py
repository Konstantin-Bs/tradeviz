from fastapi import APIRouter, WebSocket
from services.websocket_service import websocket_connect

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
  await websocket.accept()
  await websocket_connect(websocket)