import React from "react";
import { LogOut, X, Anchor, AlertCircle } from "lucide-react";

const LogoutModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay - Effet givré ultra-doux */}
      <div
        className="fixed inset-0 bg-[#202042]/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card - Style "Galet" */}
      <div className="relative bg-white/90 backdrop-blur-2xl w-full max-w-sm rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.15)] p-8 border border-white animate-in zoom-in duration-300">
        {/* Close Button - Discret */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-300 hover:text-[#202042] p-2 rounded-full hover:bg-slate-100 transition-all"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center mt-4">
          {/* Icône d'alerte stylisée marine */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[28px] flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
              <Anchor size={36} className="rotate-[-10deg]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-red-50">
              <AlertCircle size={16} className="text-red-500" />
            </div>
          </div>

          <h3 className="text-2xl font-black text-[#202042] mb-3 tracking-tight">
            Larguer les amarres ?
          </h3>
          <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed px-4">
            Êtes-vous sûr de vouloir quitter votre session de gestion ?
          </p>

          {/* Actions - Boutons larges et arrondis */}
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogOut size={18} />
                  Se déconnecter
                </>
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-4 text-slate-400 hover:text-[#202042] font-black text-xs uppercase tracking-widest rounded-2xl transition-all"
            >
              Rester à bord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
