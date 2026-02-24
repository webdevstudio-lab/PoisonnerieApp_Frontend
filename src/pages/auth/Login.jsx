import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Lock,
  Waves,
  ArrowRight,
} from "lucide-react";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/axiosInstance";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await API.post(API_PATHS.AUTH.LOGIN, formData);
      if (res.data.success) {
        const userData = res.data.data;

        // 1. Mettre à jour le contexte (et localStorage)
        login(userData);

        // 2. Redirection directe basée sur le rôle technique (admin, agent, superviseur)
        // Note: adapter "userData.user.role" selon la structure exacte de ton API
        const role = userData.user?.role || userData.role;

        if (role === "admin") {
          navigate("/dashboard");
        } else {
          // Les vendeurs/agents vont directement aux points de vente
          navigate("/salesPoints");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Identifiants incorrects");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F0F7FF] p-4">
      <div className="relative z-10 w-full max-w-[460px]">
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-white rounded-[30px] shadow-xl flex items-center justify-center mb-4 border border-blue-50">
            <Waves className="text-[#3498DB]" size={40} />
          </div>
          <h1 className="font-black text-[#202042] text-2xl tracking-tighter uppercase">
            Océan<span className="text-[#3498DB]">Gestion</span>
          </h1>
        </div>

        <div className="bg-white rounded-[45px] p-10 lg:p-14 shadow-xl border border-white">
          <h2 className="text-3xl font-black text-[#202042] text-center mb-8">
            Connexion
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                Identifiant
              </label>
              <div className="relative group">
                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3498DB]"
                  size={18}
                />
                <input
                  type="text"
                  required
                  className="w-full pl-14 pr-6 py-4.5 bg-[#F8FAFC] border-2 border-transparent rounded-[22px] outline-none font-bold focus:bg-white focus:border-[#3498DB]/20"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3498DB]"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-14 pr-14 py-4.5 bg-[#F8FAFC] border-2 border-transparent rounded-[22px] outline-none font-bold focus:bg-white focus:border-[#3498DB]/20"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-bold px-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#202042] text-white py-5 rounded-[22px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Entrer dans la halle <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
