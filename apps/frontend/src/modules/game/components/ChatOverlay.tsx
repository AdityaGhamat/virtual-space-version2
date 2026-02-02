import { useEffect, useState, useRef } from "react";
import { Send, X, MessageSquare } from "lucide-react";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../../auth/hooks/useAuth";
import type { Message } from "../types/utils";

const ChatOverlay = ({ username }: { username: string }) => {
  const { commSocket } = useSocket();
  const { user } = useAuth();

  const userData = user;

  const [isOpen, setIsOpen] = useState(false);
  const [currentZone, setCurrentZone] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEnter = (e: any) => {
      const zoneName = e.detail;

      setIsOpen(true);
      setCurrentZone(zoneName);
      const pathParts = window.location.pathname.split("/");
      const gameId = pathParts[pathParts.indexOf("room") + 1];

      if (commSocket && gameId) {
        commSocket.emit("joinChatRoom", {
          roomId: gameId,
          roomName: zoneName,
        });
      }
    };

    const handleLeave = () => {
      setIsOpen(false);
      setCurrentZone(null);
      const pathParts = window.location.pathname.split("/");
      const gameId = pathParts[pathParts.indexOf("room") + 1];

      if (commSocket && gameId) {
        commSocket.emit("leaveChatRoom", { roomId: gameId });
      }
    };

    window.addEventListener("ENTER_CHAT_ZONE", handleEnter);
    window.addEventListener("LEAVE_CHAT_ZONE", handleLeave);

    return () => {
      window.removeEventListener("ENTER_CHAT_ZONE", handleEnter);
      window.removeEventListener("LEAVE_CHAT_ZONE", handleLeave);
    };
  }, [commSocket]);

  useEffect(() => {
    if (!commSocket) return;

    const handleMessage = (data: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          senderId: data.senderId,
          senderName: data.username,
          text: data.message,
          timestamp: data.timestamp,
        },
      ]);
      scrollToBottom();
    };

    const handleHistory = (history: any[]) => {
      const formatted = history.map((msg: any) => ({
        id: msg.id,
        senderId: msg.senderId,
        senderName: msg.username,
        text: msg.message,
        timestamp: msg.timestamp,
      }));
      setMessages(formatted);
      scrollToBottom();
    };

    commSocket.on("chatMessage", handleMessage);
    commSocket.on("chatHistory", handleHistory);

    return () => {
      commSocket.off("chatMessage", handleMessage);
      commSocket.off("chatHistory", handleHistory);
    };
  }, [commSocket]);

  const scrollToBottom = () => {
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !commSocket || !userData) return;

    const pathParts = window.location.pathname.split("/");
    const gameId = pathParts[pathParts.indexOf("room") + 1];

    if (!gameId) return;

    commSocket.emit("sendMessage", {
      message: inputValue,
      roomId: gameId,
      roomName: currentZone || "General",
      username: username || userData.username,
      userId: userData.id,
    });

    setInputValue("");
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-6 left-6 z-50 w-96 animate-fade-in-up">
      <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-96">
        {/* Header */}
        <div className="bg-slate-800/50 p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {currentZone ? `${currentZone} Log` : "Mission Log"}
              </h3>
              <p className="text-xs text-slate-400">Live Feed</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
          {messages.map((msg) => {
            const isMe =
              msg.senderId === userData?.id || msg.senderName === username;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-slate-700/50 text-slate-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {isMe ? "You" : msg.senderName}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={sendMessage}
          className="p-3 bg-black/20 border-t border-white/5"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message ${currentZone || "..."}`}
              className="w-full bg-slate-800/50 text-white placeholder:text-slate-500 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 p-2 bg-indigo-500 text-white rounded-lg"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatOverlay;
