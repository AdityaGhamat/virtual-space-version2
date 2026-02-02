import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Loader2, AlertTriangle, User, Mail, Lock } from "lucide-react";
import { signupSchema } from "../validations";
import { signup } from "../api/auth";
import { CustomToast } from "../../../components/Toast";
import { useAuth } from "../hooks/useAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit is clicked");
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse(formData);
    console.log(`result : ${result}`);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string") {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsLoading(true);
      const result = await signup(formData);
      if (result.success) {
        await refetchUser();
        CustomToast.success("Successfully Registered");
        navigate("/");
      }
      setIsLoading(false);
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed";
      CustomToast.error(message);
      setErrors({ form: message });
      setFormData({ username: "", email: "", password: "" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center p-4 font-mono relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="w-full max-w-md bg-slate-100 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] relative z-10">
        <div className="bg-slate-900 p-3 flex justify-between items-center select-none">
          <span className="text-white text-xs tracking-widest uppercase font-bold">
            System_Register_v1.0
          </span>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 border border-white/20"></div>
            <div className="w-3 h-3 bg-yellow-500 border border-white/20"></div>
            <div className="w-3 h-3 bg-green-500 border border-white/20"></div>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">
              New Recruit
            </h1>
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wide">
              Create your identity to enter
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Codename (Name)
              </label>
              <input
                type="text"
                className={`w-full bg-white border-2 p-3 text-sm focus:outline-none transition-all
                  ${
                    errors.name
                      ? "border-red-500 focus:border-red-600 text-red-900 placeholder:text-red-300"
                      : "border-slate-300 focus:border-indigo-600 focus:shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]"
                  }`}
                placeholder="COMMANDER_SHEPARD"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
              {errors.name && (
                <div className="flex items-center gap-2 text-red-600 mt-1 animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {errors.name}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Communication Link (Email)
              </label>
              <input
                type="email"
                className={`w-full bg-white border-2 p-3 text-sm focus:outline-none transition-all
                  ${
                    errors.email
                      ? "border-red-500 focus:border-red-600 text-red-900 placeholder:text-red-300"
                      : "border-slate-300 focus:border-indigo-600 focus:shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]"
                  }`}
                placeholder="USER@SYSTEM.NET"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && (
                <div className="flex items-center gap-2 text-red-600 mt-1 animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {errors.email}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Security Key (Password)
              </label>
              <input
                type="password"
                className={`w-full bg-white border-2 p-3 text-sm focus:outline-none transition-all
                  ${
                    errors.password
                      ? "border-red-500 focus:border-red-600 text-red-900 placeholder:text-red-300"
                      : "border-slate-300 focus:border-indigo-600 focus:shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]"
                  }`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {errors.password && (
                <div className="flex items-center gap-2 text-red-600 mt-1 animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {errors.password}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-indigo-600 text-white border-2 border-indigo-900 py-4 text-sm font-bold uppercase tracking-widest hover:bg-indigo-500 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(30,27,75,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  INITIALIZING...
                </>
              ) : (
                "INITIALIZE USER >"
              )}
            </button>

            <div className="text-center mt-6 pt-6 border-t-2 border-slate-200 border-dashed">
              <span className="text-xs font-bold text-slate-500 uppercase mr-2">
                Already have an ID?
              </span>
              <Link
                to="/login"
                className="text-xs font-black text-indigo-600 uppercase hover:text-indigo-500 hover:underline decoration-2"
              >
                ACCESS LOGIN
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
