import React, { createContext, useState, useEffect, useMemo } from "react";
import type { ISocketContext } from "../types/socketcontext";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { serverLink } from "../constants/server";
export const SocketContext = createContext<ISocketContext>({
  gameSocket: null,
  commSocket: null,
  mediaSocket: null,
});

export default function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [gameSocket, setGameSocket] = useState<Socket | null>(null);
  const [commSocket, setCommSocket] = useState<Socket | null>(null);
  const [mediaSocket, setMediaSocket] = useState<Socket | null>(null); // New State
  useEffect(() => {
    const newGameSocket = io(`${serverLink}/game`, {
      reconnectionAttempts: 5,
    });
    const newCommSocket = io(`${serverLink}/comm`);
    const newMediaSocket = io(`${serverLink}/media`);

    setGameSocket(newGameSocket);
    setCommSocket(newCommSocket);
    setMediaSocket(newMediaSocket);
    return () => {
      newGameSocket.disconnect();
      newCommSocket.disconnect();
      newMediaSocket.disconnect();
    };
  }, []);
  const contextValue = useMemo(() => {
    return { gameSocket, commSocket, mediaSocket };
  }, [gameSocket, commSocket, mediaSocket]);
  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
