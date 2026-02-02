import { Router } from "express";
import { validate } from "../../auth/middleware/validation.middleware";
import { createRoomSchema } from "../validation/room";
import roomController from "../room.controller";

const roomRouter = Router();

roomRouter.post(
  "/create",
  validate(createRoomSchema, "body"),
  roomController.CreateRoomMethod
);

export default roomRouter