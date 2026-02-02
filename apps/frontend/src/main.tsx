import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { routes } from "./routes/routes.tsx";
import SocketContextProvider from "./modules/game/network(context)/socketContext.tsx";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./modules/auth/context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SocketContextProvider>
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 4000,
        }}
      />
      <RouterProvider router={routes} />
    </SocketContextProvider>
  </AuthProvider>
);
