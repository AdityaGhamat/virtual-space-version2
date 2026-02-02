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
    x: -540,
    y: 55,
    width: 138,
    height: 111,
    capabilities: ["video_call"],
    description: "Meeting Room - Test area",
  },
];
