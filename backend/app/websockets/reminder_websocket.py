# ============================================================
# backend/app/websockets/reminder_websocket.py
# ============================================================

from collections import defaultdict

from fastapi import WebSocket


class ReminderConnectionManager:

    def __init__(self):
        self.active_connections = defaultdict(set)

    async def connect(
        self,
        employee_id: int,
        websocket: WebSocket,
    ):
        await websocket.accept()

        self.active_connections[
            employee_id
        ].add(websocket)

    def disconnect(
        self,
        employee_id: int,
        websocket: WebSocket,
    ):
        connections = self.active_connections.get(
            employee_id
        )

        if not connections:
            return

        connections.discard(websocket)

        if not connections:
            self.active_connections.pop(
                employee_id,
                None,
            )

    async def send_to_employee(
        self,
        employee_id: int,
        message: dict,
    ):
        connections = self.active_connections.get(
            employee_id,
            set(),
        )

        if not connections:
            return

        disconnected = []

        for websocket in connections:
            try:
                await websocket.send_json(
                    message
                )

            except Exception:
                disconnected.append(
                    websocket
                )

        for websocket in disconnected:
            self.disconnect(
                employee_id,
                websocket,
            )


reminder_manager = ReminderConnectionManager()