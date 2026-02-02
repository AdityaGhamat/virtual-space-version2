import toast from "react-hot-toast";
import type { ToastProps } from "../types/core";
import { TOAST_TYPES } from "../utils/toast.utils";

const Toast = ({ t, type, children }: ToastProps) => {
  const style = TOAST_TYPES[type];

  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      style={{ animationDuration: "0.3s" }}
    >
      <div
        className={`
          relative w-full border-4 flex overflow-hidden
          ${style.bgColor} ${style.borderColor} 
          /* Pixel Shadow */
          shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
          transition-all duration-300
        `}
      >
        <div
          className={`p-4 border-r-4 ${style.borderColor} flex items-center justify-center bg-white/20`}
        >
          {style.icon}
        </div>

        <div className="flex-1 p-3 font-mono">
          <div
            className={`text-[10px] font-black tracking-widest uppercase mb-1 ${style.textColor} opacity-70`}
          >
            {style.title}
          </div>

          <div
            className={`text-sm font-bold ${style.textColor} uppercase leading-tight`}
          >
            {children}
          </div>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          className={`
            border-l-4 ${style.borderColor} p-2 flex flex-col items-center justify-center
            hover:bg-black/10 active:bg-black/20 transition-colors
          `}
        >
          <span className="text-[10px] font-black text-black/50">X</span>
        </button>
      </div>
    </div>
  );
};

export const CustomToast = {
  success: (message: React.ReactNode) =>
    toast.custom((t) => (
      <Toast t={t} type="success">
        {message}
      </Toast>
    )),

  error: (message: React.ReactNode) =>
    toast.custom((t) => (
      <Toast t={t} type="error">
        {message}
      </Toast>
    )),

  warning: (message: React.ReactNode) =>
    toast.custom((t) => (
      <Toast t={t} type="warning">
        {message}
      </Toast>
    )),
  info: (message: React.ReactNode) =>
    toast.custom((t) => (
      <Toast t={t} type="info">
        {message}
      </Toast>
    )),
};
