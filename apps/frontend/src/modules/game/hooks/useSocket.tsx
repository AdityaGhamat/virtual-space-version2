import { useContext } from "react";
import { SocketContext } from "../network(context)/socketContext";

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside SocketContextProvider");
  }
  return context;
};
