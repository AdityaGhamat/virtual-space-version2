import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../auth/utility";
import roomService from "./service/room.service";

class RoomController {
  public async CreateRoomMethod(req: Request, res: Response) {
    try {
      const reqBody = req.body;
      const result = await roomService.createRoom(reqBody);
      return SuccessResponse(res, 201, result, "Room is created", {});
    } catch (error) {
      return ErrorResponse(res, 400, {}, "", error);
    }
  }
}

export default new RoomController();
