import type {
  ClientToCommEvents,
  CommToClientEvents,
} from "./modules/core/types/game";
import express, { Response, Request } from "express";
import { gameHandler } from "./modules/game/handlers/gameHandler";
import { commHandler } from "./modules/game/handlers/commHandler";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import apiRoutes from "./routes";
import { errorMiddleware } from "./modules/core/middleware/errorMiddleware";
import cookieParser from "cookie-parser";
import { mediaHandler } from "./modules/sfu/handler/mediaHandler";

const app = express();
const httpServer = createServer(app);

httpServer.on("connection", (socket) => {
  socket.on("error", (err) => {
    if ((err as any).code === "ECONNRESET") return;

    console.error("Socket error:", err);
  });
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const io = new Server<ClientToCommEvents, CommToClientEvents>(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use("/api", apiRoutes);

const clientBuildPath = path.join(__dirname, "../../frontend/dist");

app.use(express.static(clientBuildPath));

app.use((req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/dist/index.html"));
});
app.use(errorMiddleware);

gameHandler(io);
commHandler(io);
mediaHandler(io);

export default httpServer;
