import { User, X, LogOut, MapPin, Wifi } from "lucide-react"; // Changed icons

const ProfileModal = ({ user, onClose, onLogout }: any) => {
  const userData = user;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-800 border-4 border-slate-400 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.5)] relative">
        <div className="bg-slate-400 p-2 flex justify-between items-center border-b-4 border-slate-600">
          <span className="text-slate-900 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4" />
            Personnel_File.dat
          </span>
          <button
            onClick={onClose}
            className="hover:bg-red-500 hover:text-white p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 font-mono text-slate-200">
          <div className="flex gap-4 items-start">
            <div className="w-20 h-20 bg-indigo-600 border-2 border-white/50 flex items-center justify-center shrink-0 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-1 overflow-hidden">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                Codename
              </div>
              <div className="text-xl font-bold text-white uppercase truncate">
                {userData?.username || "UNKNOWN"}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">
                Comm_Link
              </div>
              <div className="text-xs text-indigo-300 truncate">
                {userData?.email || "NO_EMAIL"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/50 p-3 border border-slate-600">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase mb-1">
                <MapPin className="w-3 h-3" /> Current Zone
              </div>

              <div className="text-lg font-bold text-yellow-400">LOBBY</div>
            </div>
            <div className="bg-slate-900/50 p-3 border border-slate-600">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase mb-1">
                <Wifi className="w-3 h-3" /> Signal
              </div>
              <div className="text-lg font-bold text-green-400">STABLE</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white border-2 border-red-800 hover:border-red-400 py-3 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Terminate Session
            </span>
          </button>
        </div>

        <div className="bg-slate-900 p-2 text-center border-t-2 border-slate-600">
          <span className="text-[9px] text-slate-600 uppercase">
            System ID: {userData?.id?.slice(0, 8) || "ERROR"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
