import { useEffect, useState } from "react";
import VideoRoom from "./VideoRoom";
import { useSocket } from "../hooks/useSocket";

const ProximityVideoOverlay = () => {
  const { mediaSocket } = useSocket();
  const [activeZone, setActiveZone] = useState<string | null>(null);

  useEffect(() => {
    const handleEnterVideo = (e: any) => {
      const zoneName = e.detail;
      console.log("🎥 Entering Video Zone:", zoneName);
      setActiveZone(zoneName);
    };

    const handleLeaveVideo = () => {
      console.log("🚫 Leaving Video Zone");
      setActiveZone(null);
    };

    window.addEventListener("ENTER_VIDEO_ZONE", handleEnterVideo);
    window.addEventListener("LEAVE_VIDEO_ZONE", handleLeaveVideo);

    return () => {
      window.removeEventListener("ENTER_VIDEO_ZONE", handleEnterVideo);
      window.removeEventListener("LEAVE_VIDEO_ZONE", handleLeaveVideo);
    };
  }, []);

  if (!activeZone || !mediaSocket) return null;

  const pathParts = window.location.pathname.split("/");
  const mainRoomId = pathParts[pathParts.indexOf("room") + 1];
  const uniqueVoiceRoomId = `${mainRoomId}-${activeZone}`;

  return (
    <div className="fixed top-4 right-4 z-50">
      <VideoRoom roomId={uniqueVoiceRoomId} />
    </div>
  );
};

export default ProximityVideoOverlay;
