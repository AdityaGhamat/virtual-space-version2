import type {
  ClientToCommEvents,
  CommToClientEvents,
} from "./modules/core/types/game";
import express from "express";
import { gameHandler } from "./modules/game/handlers/gameHandler";
import { commHandler } from "./modules/game/handlers/commHandler";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import apiRoutes from "./routes";
import { errorMiddleware } from "./modules/core/middleware/errorMiddleware";
// import { allowedOrigins } from "./modules/core/utility/allowedorigins"; // Not needed if we allow all for dev
import cookieParser from "cookie-parser";
import { mediaHandler } from "./modules/sfu/handler/mediaHandler";

const app = express();
const httpServer = createServer(app);

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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use("/api", apiRoutes);
app.use(errorMiddleware);

gameHandler(io);
commHandler(io);
mediaHandler(io);

export default httpServer;
