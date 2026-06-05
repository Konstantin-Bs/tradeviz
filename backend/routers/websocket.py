from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.websocket_service import websocket_connect, manager

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
  await websocket.accept()
  await manager.connect(websocket)
  try:
    while True:
      await websocket.receive_text()
  except WebSocketDisconnect:
    await manager.disconnect(websocket)