import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "./LogoutModal";
import ProfileDropdown from "./ProfileDropdown";

import {
  LayoutDashboard,
  Store,
  Ship,
  Briefcase,
  Box,
  UserCheck,
  TrendingDown,
  Wallet,
  History,
  Settings,
  LogOut,
  Menu,
  Search,
  Bell,
  Waves,
} from "lucide-react";

const DashboardLayout = ({ children, activeMenu }) => {
  const { logout, user } = useAuth(); // 'user' contient les données de ton localStorage
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Vérification du rôle
  const isAdmin = user?.user.role === "admin";
  const currentPath = location.pathname.split("/")[1] || "dashboard";
  const activeNavItem = activeMenu || currentPath;

  // PROTECTION DE ROUTE : Si pas admin et tente d'accéder à autre chose que salesPoints
  if (!isAdmin && currentPath !== "salesPoints") {
    return <Navigate to="/salesPoints" replace />;
  }

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

  // Liste complète des menus
  const allMenuItems = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      adminOnly: true,
    },
    {
      id: "salesPoints",
      label: "Points de vente",
      icon: Store,
      adminOnly: false,
    },
    { id: "store", label: "Gestion Stocks", icon: Ship, adminOnly: true },
    {
      id: "suppliers",
      label: "Fournisseurs",
      icon: Briefcase,
      adminOnly: true,
    },
    { id: "products", label: "Catalogue Produits", icon: Box, adminOnly: true },
    { id: "users", label: "Équipe & Staff", icon: UserCheck, adminOnly: true },
    {
      id: "depenses",
      label: "Mes Dépenses",
      icon: TrendingDown,
      adminOnly: true,
    },
    { id: "caisse", label: "Ma Caisse", icon: Wallet, adminOnly: true },
    { id: "archive", label: "Archives", icon: History, adminOnly: true },
    { id: "settings", label: "Paramètres", icon: Settings, adminOnly: true },
  ];

  // FILTRAGE : On ne garde que les items autorisés
  const menuItems = allMenuItems.filter((item) => isAdmin || !item.adminOnly);

  return (
    <div className="flex h-screen bg-[#F0F7FF] font-body overflow-hidden text-[#202042]">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#202042]/40 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 p-4 transform transition-transform duration-500 ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div className="flex flex-col h-full bg-[#202042] rounded-[40px] shadow-2xl overflow-hidden border border-white/5">
          <div className="p-8 flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-lg">
              <Waves className="text-[#3498DB]" size={28} />
            </div>
            <h1 className="text-lg font-black tracking-tighter text-white uppercase">
              Océan<span className="text-[#3498DB]">Gestion</span>
            </h1>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = activeNavItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(`/${item.id}`);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-[22px] transition-all duration-300 group ${
                    isActive
                      ? "bg-white text-[#202042] shadow-xl translate-x-1"
                      : "text-blue-100/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={`${isActive ? "text-[#3498DB]" : "opacity-50 group-hover:opacity-100"}`}
                  />
                  <span className="text-[12.5px] tracking-wide font-bold">
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-[#3498DB] rounded-full shadow-[0_0_8px_#3498DB]"></div>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-6">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-[24px] transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 p-4">
        <header className="h-20 bg-white/70 backdrop-blur-md rounded-[30px] shadow-sm border border-white flex items-center justify-between px-8 mb-4">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 bg-white text-[#202042] rounded-xl shadow-sm border border-slate-100"
              >
                <Menu size={20} />
              </button>
            )}
            <div>
              <h2 className="text-lg font-black text-[#202042]">
                Salut,{" "}
                <span className="text-[#3498DB] capitalize">
                  {user?.name || "Capitaine"}
                </span>{" "}
                👋
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  {user?.role} •{" "}
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-slate-50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-[11px] font-bold outline-none w-56"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl">
              <button className="relative p-2 text-slate-400 hover:text-[#3498DB] bg-white rounded-xl shadow-sm border border-slate-50">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <ProfileDropdown />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-white/40 backdrop-blur-sm rounded-[35px] border border-white/50 shadow-inner">
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
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
