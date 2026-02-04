import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { signinSchema } from "../validations";
import { Link, useNavigate } from "react-router";
import { signin } from "../api/auth";
import { CustomToast } from "../../../components/Toast";
import { useAuth } from "../hooks/useAuth";
import Seo from "../../../components/Seo";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError({});

    const result = signinSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string") {
          fieldErrors[field] = issue.message;
        }
      });
      setError(fieldErrors);
      return;
    }

    try {
      setIsLoading(true);
      const res = await signin(result.data);
      if (res.success) {
        await refetchUser();
        CustomToast.success("Login Successfull");
        navigate("/");
      }
      setIsLoading(false);
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed";
      CustomToast.error(message);
      setError({ form: message });
      setFormData({ email: "", password: "" });
    } finally {
      setError({});
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center p-4 font-mono relative overflow-hidden">
      <Seo
        title="Login - System Auth"
        description="Login to access the virtual space and manage your character."
      />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="w-full max-w-md bg-slate-100 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] relative z-10">
        <div className="bg-slate-900 p-3 flex justify-between items-center">
          <span className="text-white text-xs tracking-widest uppercase">
            System_Auth_v1.0
          </span>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">
              Player Login
            </h1>
            <p className="text-xs text-slate-600 font-bold">
              INSERT COIN OR ENTER CREDENTIALS
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 block">
                Email
              </label>
              <input
                type="email"
                className={`w-full bg-white border-2 p-3 text-sm focus:outline-none transition-all
                  ${
                    error.email
                      ? "border-red-500 focus:border-red-600 text-red-900 placeholder:text-red-300"
                      : "border-slate-300 focus:border-indigo-600 focus:shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]"
                  }`}
                placeholder="player@world.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              {error.email && (
                <div className="flex items-center gap-2 text-red-600 mt-1 animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {error.email}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 block">
                Pass_Key
              </label>
              <input
                type="password"
                className={`w-full bg-white border-2 p-3 text-sm focus:outline-none transition-all
                  ${
                    error.password
                      ? "border-red-500 focus:border-red-600 text-red-900 placeholder:text-red-300"
                      : "border-slate-300 focus:border-indigo-600 focus:shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]"
                  }`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              {error.password && (
                <div className="flex items-center gap-2 text-red-600 mt-1 animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {error.password}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-indigo-600 text-white border-2 border-indigo-900 py-4 text-sm font-bold uppercase tracking-widest hover:bg-indigo-500 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(30,27,75,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  CONNECTING...
                </>
              ) : (
                "ENTER WORLD >"
              )}
            </button>

            <div className="flex justify-between text-xs font-bold text-slate-500 mt-6 pt-6 border-t-2 border-slate-200 border-dashed">
              <Link to={"/register"} className="">
                <button
                  type="button"
                  className="hover:text-indigo-600 hover:underline decoration-2 cursor-pointer"
                >
                  CREATE CHARACTER
                </button>
              </Link>

              <button
                type="button"
                className="hover:text-red-500 hover:underline decoration-2"
              >
                FORGOT KEY?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
