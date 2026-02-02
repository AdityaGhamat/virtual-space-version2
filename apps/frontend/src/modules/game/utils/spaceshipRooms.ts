import type { SpaceShipRoomType } from "../types/utils";
export const spaceshipRooms: SpaceShipRoomType = [
  {
    name: "meeting_room",
    x: 627,
    y: 43,
    width: 138,
    height: 111,
    capabilities: ["chat"],
    description: "Meeting Room - Test area",
  },
  {
    name: "conference_room",
    x: 96,
    y: -305,
    width: 498,
    height: 456,
    capabilities: ["video_call"],
    description: "Main Conference Hall (Cafeteria)",
  },
];
