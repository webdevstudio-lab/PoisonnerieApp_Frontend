import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Waves,
  Users,
  X,
} from "lucide-react";

const DashboardLayout = ({ children, activeMenu }) => {
  const { logout, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPath = location.pathname.split("/")[1] || "dashboard";
  const isAdmin = user?.user?.role === "admin";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login", { replace: true });
      } else if (
        !isAdmin &&
        currentPath !== "salesPoints" &&
        currentPath !== "profile"
      ) {
        navigate("/salesPoints", { replace: true });
      }
    }
  }, [user, isAdmin, currentPath, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F0F7FF]">
        <Waves className="text-[#3498DB] animate-bounce mb-4" size={48} />
        <p className="text-[#202042] font-black text-xs uppercase tracking-[0.2em]">
          Chargement de la session...
        </p>
      </div>
    );
  }

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
    { id: "clients", label: "Clients", icon: Users, adminOnly: true },
    { id: "caisse", label: "Ma Caisse", icon: Wallet, adminOnly: true },
    { id: "archive", label: "Archives", icon: History, adminOnly: true },
    { id: "settings", label: "Paramètres", icon: Settings, adminOnly: true },
  ];

  const menuItems = allMenuItems.filter((item) => isAdmin || !item.adminOnly);
  const activeNavItem = activeMenu || currentPath;

  return (
    <div className="flex h-screen bg-[#F0F7FF] font-body overflow-hidden text-[#202042] relative">
      {/* OVERLAY MOBILE : Ferme la sidebar au clic à l'extérieur */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#202042]/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 p-4 transform transition-transform duration-500 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full bg-[#202042] rounded-[40px] shadow-2xl overflow-hidden border border-white/5">
          {/* Close button mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-8 right-8 text-white/50 hover:text-white"
          >
            <X size={24} />
          </button>

          <div className="p-8 flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-3">
              <Waves className="text-[#3498DB]" size={28} />
            </div>
            <h1 className="text-lg font-black text-white uppercase tracking-tighter">
              Océan<span className="text-[#3498DB]">Gestion</span>
            </h1>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(`/${item.id}`);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-[22px] transition-all group ${
                  activeNavItem === item.id
                    ? "bg-white text-[#202042] shadow-xl"
                    : "text-blue-100/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon
                  size={18}
                  className={
                    activeNavItem === item.id ? "text-[#3498DB]" : "opacity-50"
                  }
                />
                <span className="text-[12.5px] font-bold">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-6">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 text-red-400 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-white/70 backdrop-blur-md rounded-[30px] flex items-center justify-between px-6 lg:px-8 shrink-0 shadow-sm border border-white/20 mb-4">
          <div className="flex items-center gap-4">
            {/* BOUTON HAMBURGER : Visible uniquement sur mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 bg-[#202042] text-white rounded-2xl shadow-lg shadow-[#202042]/20 hover:scale-95 transition-transform"
            >
              <Menu size={20} />
            </button>

            <h2 className="text-sm lg:text-lg font-black truncate">
              Salut,{" "}
              <span className="text-[#3498DB] capitalize">
                {user?.user.name || "Capitaine"}
              </span>{" "}
              👋
            </h2>
          </div>
        </header>

        {/* CONTENU DYNAMIQUE */}
        <main className="flex-1 overflow-y-auto bg-white/40 backdrop-blur-sm rounded-[35px] p-4 lg:p-8 border border-white/20 shadow-inner">
          {children}
        </main>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout();
          navigate("/login");
        }}
      />
    </div>
  );
};

export default DashboardLayout;
