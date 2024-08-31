import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

enum MessageType {
  Join = "join",
  Leave = "leave",
  StartGame = "startGame",
  Notification = "notification",
  GameStarted = "gameStarted",
}

type Message = {
  type: MessageType;
  sessionId: string;
  lobbyId: string;
  data: any;
};

type WebSocketContextType = {
  connect: (sessionId: string, lobbyId: string) => void;
  disconnect: () => void;
  sendMessage: (msg: Message) => void;
  onMessage: (callback: (msg: Message) => void) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onMessageCallback, setOnMessageCallback] = useState<
    (msg: Message) => void
  >(() => () => {});
  const location = useLocation();

  useEffect(() => {
    const allowedRoutes = ["/lobby", "/game"];

    if (!allowedRoutes.includes(location.pathname)) {
      console.log(
        "WebSocket connection not allowed on this route:",
        location.pathname,
      );
      return;
    }

    const VITE_WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;
    console.log("Connecting to WebSocket:", VITE_WS_BASE_URL); // Debugging line

    const socket = new WebSocket(VITE_WS_BASE_URL);
    setWs(socket);

    socket.onmessage = (event) => {
      try {
        const data: Message = JSON.parse(event.data);
        if (onMessageCallback) {
          onMessageCallback(data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [onMessageCallback, location.pathname]);

  const sendMessage = (msg: Message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messageString = JSON.stringify(msg);
      console.log("Sending message:", messageString);
      ws.send(messageString);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  const connect = (sessionId: string, lobbyId: string) => {
    const joinMessage: Message = {
      type: MessageType.Join,
      sessionId,
      lobbyId,
      data: null,
    };
    sendMessage(joinMessage);
  };

  const disconnect = () => {
    if (ws) {
      ws.close();
    }
  };

  const onMessage = (callback: (msg: Message) => void) => {
    setOnMessageCallback(() => callback);
  };

  return (
    <WebSocketContext.Provider
      value={{ connect, disconnect, sendMessage, onMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider",
    );
  }
  return context;
};
