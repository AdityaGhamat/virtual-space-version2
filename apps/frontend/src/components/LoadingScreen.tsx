import { useEffect, useState } from "react";
import { Terminal, Cpu, Wifi } from "lucide-react";

const LOADING_MESSAGES = [
  "INITIALIZING_KERNEL...",
  "LOADING_SPRITES...",
  "CONNECTING_TO_MAINFRAME...",
  "DECRYPTING_PACKETS...",
  "GENERATING_TERRAIN...",
  "SYNCHRONIZING_CLOCKS...",
];

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(timer);
          return 100;
        }

        const jump = Math.floor(Math.random() * 15) + 1;
        return Math.min(old + jump, 100);
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const index = Math.floor((progress / 100) * (LOADING_MESSAGES.length - 1));
    setMessageIndex(index);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-indigo-950 font-mono text-slate-200">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(transparent 2px, #000 2px), linear-gradient(90deg, transparent 2px, #000 2px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative w-full max-w-md p-8 bg-slate-900 border-4 border-slate-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center mb-8 text-indigo-400">
          <Terminal className="w-6 h-6 animate-pulse" />
          <div className="flex gap-4">
            <Cpu
              className="w-6 h-6 animate-bounce"
              style={{ animationDuration: "3s" }}
            />
            <Wifi className="w-6 h-6" />
          </div>
        </div>

        <div className="flex justify-between items-end mb-2">
          <h2 className="text-xl font-black uppercase tracking-widest text-white">
            System_Load
          </h2>
          <span className="text-2xl font-black text-indigo-400">
            {progress}%
          </span>
        </div>

        <div className="h-8 w-full border-4 border-slate-600 bg-slate-800 p-1">
          <div
            className="h-full bg-indigo-500 transition-all duration-300 ease-out shadow-[0px_0px_10px_rgba(99,102,241,0.5)]"
            style={{ width: `${progress}%` }}
          >
            <div
              className="w-full h-full opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)",
                backgroundSize: "1rem 1rem",
              }}
            ></div>
          </div>
        </div>

        <div className="mt-4 h-6 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="animate-pulse">_&gt;</span>
          {LOADING_MESSAGES[messageIndex]}
        </div>
      </div>

      <div className="absolute bottom-8 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] animate-pulse">
        Don't turn off the console
      </div>
    </div>
  );
};

export default LoadingScreen;
