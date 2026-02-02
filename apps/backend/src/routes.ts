import { Router } from "express";
import authRouter from "./modules/auth/router/auth.router";
import roomRouter from "./modules/room/router/room.router";
const apiRoutes = Router();

apiRoutes.use("/auth", authRouter);
apiRoutes.use("/room", roomRouter);
export default apiRoutes;
