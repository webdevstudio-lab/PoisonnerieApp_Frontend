import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // On s'assure que le container est relatif pour le positionnement de l'enfant
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
      >
        <div className="w-8 h-8 rounded-full bg-[#3498DB] flex items-center justify-center text-white font-bold text-sm shadow-sm">
          {/* Correction ici : utilisation de .name selon votre schéma */}
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-black text-[#202042] leading-none">
            {user?.name}
          </p>
          <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1">
            {user?.role}
          </p>
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-56 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-50 py-3 animate-in fade-in zoom-in-95 duration-200"
          // z-[9999] pour passer au dessus de la sidebar et du header
          style={{ zIndex: 9999 }}
        >
          <div className="px-5 py-3 border-b border-slate-50 mb-2">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Session
            </p>
            <p className="text-sm font-bold text-[#202042] truncate">
              {user?.usermane || "Utilisateur"}
            </p>
          </div>

          <div className="px-2 space-y-1">
            <button
              onClick={() => {
                navigate("/profile");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-[#3498DB] rounded-xl transition-colors"
            >
              <User size={18} /> Mon Profil
            </button>

            <button
              onClick={() => {
                navigate("/settings");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-[#3498DB] rounded-xl transition-colors"
            >
              <Settings size={18} /> Paramètres
            </button>
          </div>

          <div className="h-px bg-slate-100 my-2 mx-4"></div>

          <div className="px-2">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut size={18} /> Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
