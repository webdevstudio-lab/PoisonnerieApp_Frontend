import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "./LogoutModal";
import ProfileDropdown from "./ProfileDropdown";
import API from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

import {
  Briefcase,
  Users,
  LogOut,
  Menu,
  Archive,
  X,
  LayoutDashboard,
  Settings,
  User,
  Ship,
  Search,
  Bell,
  Wallet,
  Waves,
} from "lucide-react";

const DashboardLayout = ({ children, activeMenu }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const activeNavItem =
    activeMenu || location.pathname.split("/")[1] || "dashboard";

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Menu complet sans restriction de rôles
  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "salesPoints", label: "Points de vente", icon: User },
    { id: "store", label: "Mon stocks", icon: Ship },
    { id: "suppliers", label: "Mes fournisseurs", icon: Wallet },
    { id: "products", label: "Mes produits", icon: Wallet },
    { id: "clients", label: "Mes clients", icon: Users },
    { id: "users", label: "Mon Équipe", icon: Users },
    { id: "depenses", label: "Dépenses", icon: Briefcase },
    { id: "archive", label: "Archives", icon: Archive },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F0F7FF] font-body overflow-hidden text-[#202042]">
      {/* SIDEBAR MOBILE OVERLAY */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#202042]/20 z-40 backdrop-blur-md transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR DYNAMIQUE */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 p-4 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full bg-[#202042] rounded-[45px] shadow-[0_20px_50px_rgba(0,53,94,0.15)] overflow-hidden">
          {/* LOGO */}
          <div className="p-8 flex flex-col items-center">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Waves className="text-[#3498DB]" size={30} />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase text-center">
              Océan<span className="text-[#3498DB]">Gestion</span>
            </h1>
          </div>

          {/* NAVIGATION (Affiche tout par défaut) */}
          <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = activeNavItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(`/${item.id}`);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] transition-all duration-300 group ${
                    isActive
                      ? "bg-white text-[#202042] shadow-xl translate-x-1"
                      : "text-blue-100/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    size={20}
                    className={`${isActive ? "text-[#3498DB]" : "opacity-50 group-hover:opacity-100"}`}
                  />
                  <span className="text-sm tracking-wide font-bold">
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-[#3498DB] rounded-full shadow-[0_0_10px_#3498DB]"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* DÉCONNEXION */}
          <div className="p-8">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-[22px] transition-all font-black text-[11px] uppercase tracking-widest group"
            >
              <LogOut
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* ZONE DE CONTENU PRINCIPALE */}
      <div className="flex-1 flex flex-col min-w-0 p-4">
        <header className="h-24 bg-white/60 backdrop-blur-xl rounded-[35px] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-white flex items-center justify-between px-8 mb-4">
          <div className="flex items-center gap-5">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-3 bg-white text-[#202042] rounded-2xl shadow-sm border border-blue-50"
              >
                <Menu size={24} />
              </button>
            )}
            <div>
              <h2 className="text-xl font-black text-[#202042]">
                Salut,{" "}
                <span className="text-[#3498DB] capitalize">
                  {/* Récupération dynamique du nom depuis le AuthContext */}
                  {user?.user.name || "Capitaine"}
                </span>{" "}
                👋
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {/* Récupération dynamique du rôle (ex: admin) */}
                  Session {user?.user.role || "Utilisateur"} •{" "}
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-[#F8FAFC] border-none rounded-[18px] py-3 pl-11 pr-4 text-xs font-bold outline-none transition-all w-64 focus:ring-4 focus:ring-blue-50 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-3 bg-[#F8FAFC] p-1.5 rounded-2xl border border-blue-50">
              <button className="relative p-2.5 text-slate-400 hover:text-[#3498DB] transition-colors bg-white rounded-xl shadow-sm">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <ProfileDropdown />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto z-0 custom-scrollbar bg-white/40 backdrop-blur-sm rounded-[40px] border border-white/50 shadow-inner">
          <div className="p-8 lg:p-12 max-w-[1600px] mx-auto animate-fadeIn">
            {children}
          </div>
        </main>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setIsLoggingOut(true);
          logout().finally(() => setIsLoggingOut(false));
        }}
        isLoading={isLoggingOut}
      />
    </div>
  );
};

export default DashboardLayout;
