import { AlertTriangle, Check, Terminal, X } from "lucide-react";

export const TOAST_TYPES = {
  success: {
    icon: <Check className="w-5 h-5 text-green-900" />,
    borderColor: "border-green-600",
    bgColor: "bg-green-100",
    shadowColor: "shadow-green-900",
    title: "SYSTEM_OK",
    textColor: "text-green-900",
  },
  error: {
    icon: <X className="w-5 h-5 text-red-900" />,
    borderColor: "border-red-600",
    bgColor: "bg-red-100",
    shadowColor: "shadow-red-900",
    title: "CRITICAL_ERR",
    textColor: "text-red-900",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-yellow-900" />,
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-100",
    shadowColor: "shadow-yellow-900",
    title: "WARNING",
    textColor: "text-yellow-900",
  },
  info: {
    icon: <Terminal className="w-5 h-5 text-blue-900" />,
    borderColor: "border-blue-600",
    bgColor: "bg-blue-100",
    shadowColor: "shadow-blue-900",
    title: "SYSTEM_MSG",
    textColor: "text-blue-900",
  },
};
