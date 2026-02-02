import React from "react";
import type { Toast } from "react-hot-toast";

export interface ToastProps {
  t: Toast;
  type: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
}
