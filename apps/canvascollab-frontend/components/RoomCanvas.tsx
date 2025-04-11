"use client";
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please sign in first");
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({
        type: "join_room",
        roomId
      }));
    };

    ws.onerror = () => {
      alert("WebSocket error occurred.");
    };
  }, [roomId]);

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}