import { useState } from "react";
import { useNavigate } from "react-router";
import { Rocket, LogIn, Gamepad2, Hash, Terminal, User } from "lucide-react";
import { useSocket } from "../modules/game/hooks/useSocket";
import { SKINS, generateMissionName } from "../utils/lobby.utils";
import { useAuth } from "../modules/auth/hooks/useAuth";
import ProfileModal from "../modules/auth/components/ProfileModal";
import { logout, createRoom } from "../modules/auth/api/auth";

const Lobby = () => {
  const [roomCode, setRoomCode] = useState<string>("");
  const [selectedSkin, setSelectedSkin] = useState("player");
  const [showProfile, setShowProfile] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();
  const { gameSocket } = useSocket();
  const { user, refetchUser } = useAuth();

  const userData = user;

  const handleCreate = async () => {
    if (!userData?.username) return;

    try {
      setIsCreating(true);

      const randomName = generateMissionName();
      const response = await createRoom(randomName);
      if (response && response.data && response.data.id) {
        navigate(`/room/${response.data.id}`, {
          state: { username: userData.username, skin: selectedSkin },
        });
      }
    } catch (error) {
      console.error("Failed to create room:", error);
      alert("Mission Aborted: Could not initialize room sequence.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Join Clicked. Status Check:", {
      roomCode,
      username: userData?.username,
      socketConnected: !!gameSocket,
      socketID: gameSocket?.id,
    });
    if (!roomCode.trim() || !userData?.username || !gameSocket) return;
    gameSocket.emit("checkRoom", roomCode, ({ exists }: { exists: any }) => {
      if (exists) {
        navigate(`/room/${roomCode}`, {
          state: { username: userData.username, skin: selectedSkin },
        });
      } else {
        alert("Room not found! Please check the code.");
      }
    });
  };

  async function logoutUser() {
    try {
      await logout();
      await refetchUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-slate-900 font-mono flex items-center justify-center overflow-hidden p-4">
      {showProfile && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          onLogout={logoutUser}
        />
      )}

      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#4f46e5 2px, transparent 2px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="w-full max-w-md bg-slate-100 border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.6)] relative z-10">
        <div className="bg-slate-900 p-3 flex justify-between items-center select-none">
          {/* ... Header ... */}
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-yellow-400" />
            <span className="text-white text-xs tracking-widest uppercase font-bold">
              Lobby_Config.sys
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-slate-500 border border-white/20"></div>
            <div className="w-3 h-3 bg-slate-500 border border-white/20"></div>
            <div className="w-3 h-3 bg-red-500 border border-white/20"></div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* ... Title ... */}
          <div className="text-center mb-8 border-b-4 border-slate-900/10 pb-6">
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
              Galactic Lobby
            </h1>
            <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-wide">
              Mission Control
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* ... Profile Button & Skin Selector ... */}
            <button
              onClick={() => setShowProfile(true)}
              className="group bg-slate-200 border-2 border-slate-400 p-4 flex items-center gap-4 hover:bg-white hover:border-indigo-500 hover:shadow-md transition-all text-left w-full"
            >
              <div className="bg-slate-800 p-2 border-2 border-slate-600 group-hover:border-indigo-600 transition-colors">
                <Terminal className="w-6 h-6 text-green-400 group-hover:text-indigo-400" />
              </div>
              <div className="flex flex-col grow">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest group-hover:text-indigo-500">
                  Current Pilot
                </span>
                <span className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  {userData?.username || "LOADING..."}
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <User className="w-5 h-5 text-indigo-500" />
              </div>
            </button>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 text-center block mb-2">
                Select Character Color
              </label>
              <div className="flex gap-3 justify-center flex-wrap p-4 bg-slate-200 border-2 border-slate-300 border-dashed">
                {SKINS.map((skin) => (
                  <button
                    key={skin.id}
                    onClick={() => setSelectedSkin(skin.id)}
                    title={skin.name}
                    className={`
                      w-10 h-10 transition-all duration-100 relative
                      ${skin.color} 
                      ${
                        selectedSkin === skin.id
                          ? "scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-white z-10"
                          : "border-2 border-black/20 opacity-70 hover:opacity-100 hover:-translate-y-1"
                      }
                    `}
                  />
                ))}
              </div>
            </div>

            {/* --- UPDATED CREATE BUTTON --- */}
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="group relative w-full flex items-center justify-center gap-3 bg-red-600 text-white border-4 border-red-900 py-4 font-bold uppercase tracking-widest hover:bg-red-500 active:translate-y-1 active:shadow-none shadow-[6px_6px_0px_0px_rgba(69,10,10,1)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <span>Initializing...</span>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  <span>Create Room</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2 opacity-50">
              <div className="grow border-t-2 border-slate-400 border-dashed"></div>
              <span className="shrink-0 mx-4 text-slate-500 text-xs font-black uppercase">
                OR
              </span>
              <div className="grow border-t-2 border-slate-400 border-dashed"></div>
            </div>

            {/* Join Room */}
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              {/* ... (Join form remains same) ... */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Room Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="CODE..."
                    className="w-full bg-slate-200 border-4 border-slate-300 text-slate-900 placeholder:text-slate-500 text-lg p-3 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] transition-all rounded-none uppercase"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!roomCode}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white border-4 border-indigo-900 py-3 font-bold uppercase tracking-wider hover:bg-indigo-500 active:translate-y-1 active:shadow-none shadow-[6px_6px_0px_0px_rgba(30,27,75,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-1"
              >
                <LogIn className="w-5 h-5" />
                <span>Join Game</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
