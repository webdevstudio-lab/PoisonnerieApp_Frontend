import React from "react";
import { useNavigate } from "react-router-dom";
import { Waves, Home, Anchor, HelpCircle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F0F7FF] relative overflow-hidden font-body p-6">
      {/* ÉLÉMENTS DÉCORATIFS (BULLES ET EAU) */}
      <div className="absolute w-[800px] h-[800px] bg-blue-100/40 rounded-full -top-60 -right-60 blur-3xl animate-pulse"></div>
      <div className="absolute w-[600px] h-[600px] bg-cyan-100/30 rounded-full -bottom-40 -left-40 blur-3xl animate-pulse delay-700"></div>

      <div className="relative z-10 w-full max-w-[550px] text-center">
        {/* LOGO SECTION */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 border border-blue-50">
            <Waves className="text-[#3498DB]" size={32} />
          </div>
          <h1 className="font-display font-black text-[#202042] text-xl tracking-tighter uppercase">
            Océan<span className="text-[#3498DB]">Gestion</span>
          </h1>
        </div>

        {/* 404 CARD - STYLE GALET GIVRÉ */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[50px] p-12 lg:p-16 shadow-[0_40px_80px_rgba(0,53,94,0.08)] border border-white">
          {/* VISUAL ERROR */}
          <div className="relative inline-block mb-8">
            <h2 className="text-[120px] font-black text-[#202042] leading-none tracking-tighter opacity-10">
              404
            </h2>
            <div className="absolute inset-0 flex items-center justify-center">
              <Anchor
                size={80}
                className="text-[#3498DB] animate-bounce-slow"
              />
            </div>
          </div>

          <div className="space-y-4 mb-12">
            <h3 className="text-3xl font-black text-[#202042] tracking-tight">
              Hors de la zone de pêche
            </h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              Il semble que vous ayez dérivé trop loin. Cette page n'existe pas
              ou a été déplacée vers d'autres eaux.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-[#202042] hover:bg-[#15152e] text-white py-5 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 active:scale-95"
            >
              <Home size={18} className="opacity-60" />
              Retour au port
            </button>

            <button
              onClick={() => window.history.back()}
              className="flex-1 bg-white border-2 border-slate-50 hover:border-[#3498DB]/20 text-[#202042] py-5 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <HelpCircle size={18} className="text-[#3498DB]" />
              Page précédente
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <p className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-40">
          Système de Navigation • Erreur de coordonnées
        </p>
      </div>

      {/* VAGUE DÉCORATIVE EN BAS */}
      <div className="absolute bottom-[-50px] left-0 w-full opacity-5 pointer-events-none">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#3498DB"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,149.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default NotFound;
