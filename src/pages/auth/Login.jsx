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
import { validateUsername, validatePassword } from "../../utils/helper";
import API from "../../utils/axiosInstance";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
  });
  const [touched, setTouched] = useState({ username: false, password: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === "username")
      setFieldErrors((p) => ({ ...p, username: validateUsername(value) }));
    if (name === "password")
      setFieldErrors((p) => ({ ...p, password: validatePassword(value) }));
  };

  const isFormValid = () => {
    return (
      !validateUsername(formData.username) &&
      !validatePassword(formData.password) &&
      formData.username &&
      formData.password
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setIsLoading(true);
    setError("");

    try {
      const loginRes = await API.post(API_PATHS.AUTH.LOGIN, formData);
      if (loginRes.data.success) {
        const userData = loginRes.data.data;
        login(userData);
        navigate(
          userData.role === "agent" || userData.role === "superviseur"
            ? "/profile"
            : "/dashboard",
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Identifiants incorrects");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F0F7FF] relative overflow-hidden font-body p-4">
      {/* ÉLÉMENTS DÉCORATIFS "EAU" */}
      <div className="absolute w-[1000px] h-[1000px] bg-blue-100/30 rounded-full -top-40 -left-40 blur-3xl"></div>
      <div className="absolute w-[800px] h-[800px] bg-cyan-50/50 rounded-full -bottom-40 -right-40 blur-3xl"></div>

      {/* PETITE VAGUE DÉCORATIVE */}
      <div className="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#00355E"
            d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[460px]">
        {/* LOGO DE LA POISSONNERIE */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-white rounded-[30px] shadow-xl shadow-blue-100 flex items-center justify-center mb-4 border border-blue-50">
            <Waves className="text-[#3498DB]" size={40} />
          </div>
          <h1 className="font-display font-black text-[#202042] text-2xl tracking-tighter uppercase">
            Océan<span className="text-[#3498DB]">Gestion</span>
          </h1>
        </div>

        {/* CARTE DE CONNEXION */}
        <div className="bg-white rounded-[45px] p-10 lg:p-14 shadow-[0_30px_60px_rgba(0,53,94,0.06)] border border-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#202042] tracking-tight mb-3">
              Connexion
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Accédez à la gestion de vos stocks et ventes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* UTILISATEUR */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                Identifiant
              </label>
              <div className="relative group">
                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3498DB] transition-colors"
                  size={18}
                />
                <input
                  name="username"
                  type="text"
                  placeholder="Ex: admin_poisson"
                  className="w-full pl-14 pr-6 py-4.5 bg-[#F8FAFC] border-2 border-transparent rounded-[22px] outline-none transition-all font-bold text-[#202042] focus:bg-white focus:border-[#3498DB]/20 focus:ring-4 focus:ring-blue-50"
                  value={formData.username}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* MOT DE PASSE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3498DB] transition-colors"
                  size={18}
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-4.5 bg-[#F8FAFC] border-2 border-transparent rounded-[22px] outline-none transition-all font-bold text-[#202042] focus:bg-white focus:border-[#3498DB]/20 focus:ring-4 focus:ring-blue-50"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#202042]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-[11px] font-black p-4 rounded-2xl border border-red-100 flex items-center gap-2 animate-shake">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                {error}
              </div>
            )}

            {/* BOUTON ACTIONS */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full bg-[#202042] hover:bg-[#15152e] text-white py-5 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 disabled:grayscale mt-4"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Entrer dans la halle
                  <ArrowRight size={18} className="opacity-50" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-50">
          Système de Gestion de Produits Halieutiques • v2.0
        </p>
      </div>
    </div>
  );
};

export default Login;
