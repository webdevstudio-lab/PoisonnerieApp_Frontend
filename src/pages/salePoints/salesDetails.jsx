import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Wallet,
  Loader2,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Imports des composants externes
import SalesStats from "./externals/SalesStats";
import TopProducts from "./externals/TopProducts";
import StockMovement from "./externals/StockMovement";
import FinancialSummary from "./externals/FinancialSummary";
import SaleModal from "./externals/SaleModal";
import VenteDetails from "./externals/VenteDetails";
import VersementDetail from "./externals/VersementDetail";
import VersementClientList from "./externals/VersementClientList";
import AddVersementClient from "./externals/AddVersementClient";

const SalesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isVersementModalOpen, setIsVersementModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDetails = useCallback(async () => {
    try {
      const res = await API.get(API_PATHS.SALES.GET_ONE.replace(":id", id));
      if (res.data.success) {
        setData(res.data.data);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Erreur chargement détails:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const openPaymentModal = (client) => {
    setSelectedClient(client);
    setIsVersementModalOpen(true);
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-slate-50/50 flex flex-col items-center justify-center gap-4 z-50">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">
          Chargement boutique...
        </p>
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 lg:space-y-8 pb-24 px-4 lg:px-8 animate-in fade-in duration-500">
      {/* Header : Navigation & Actions - Adapté Mobile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-4 lg:p-5 rounded-[25px] lg:rounded-[35px] backdrop-blur-md border border-white/80 shadow-sm mt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-slate-400 font-bold hover:text-[#202042] transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm hidden sm:inline">Retour aux boutiques</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSaleModalOpen(true)}
            className="flex-1 md:flex-none bg-blue-600 text-white px-6 lg:px-10 py-4 rounded-[20px] lg:rounded-[24px] font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-95 transition-all"
          >
            <Plus size={18} strokeWidth={3} />
            <span>Nouvelle Vente</span>
          </button>
        </div>
      </div>

      {/* Barre d'onglets défilable sur Mobile */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-[22px] lg:rounded-[28px] w-max lg:w-fit border border-slate-100 shadow-sm">
          {[
            { id: "dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
            { id: "sales", label: "Historique", icon: ShoppingBag },
            { id: "payments_store", label: "Caisse", icon: Wallet },
            { id: "payments_clients", label: "Clients", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 lg:px-6 lg:py-3.5 rounded-[18px] lg:rounded-[20px] font-bold text-[12px] lg:text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#202042] text-white shadow-lg scale-100 lg:scale-105"
                  : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              <tab.icon
                size={16}
                strokeWidth={activeTab === tab.id ? 2.5 : 2}
              />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zone de Contenu Dynamique */}
      <div className="min-h-[500px]">
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Colonne Gauche : Stats & Mouvements */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8 order-2 lg:order-1">
              <SalesStats salePointId={id} key={`stats-${refreshKey}`} />
              <StockMovement movements={data?.history} />
            </div>

            {/* Colonne Droite : Argent & Top Produits */}
            <div className="space-y-6 lg:space-y-8 order-1 lg:order-2">
              <FinancialSummary
                solde={data?.solde}
                impayer={data?.impayer}
                secondaryStore={data?.secondaryStore}
              />
              {/* Masqué sur tout petit écran si besoin, ou affiché après les finances */}
              <TopProducts products={data?.secondaryStore?.items} />
            </div>
          </div>
        )}

        {activeTab === "sales" && (
          <div className="animate-in slide-in-from-right-4 duration-300 px-1">
            <VenteDetails salePointId={id} />
          </div>
        )}

        {activeTab === "payments_store" && (
          <div className="animate-in slide-in-from-right-4 duration-300 px-1">
            <VersementDetail salePointId={id} />
          </div>
        )}

        {activeTab === "payments_clients" && (
          <div className="animate-in slide-in-from-right-4 duration-300 px-1">
            <VersementClientList
              salePointId={id}
              onPaymentAction={openPaymentModal}
            />
          </div>
        )}
      </div>

      {/* --- MODALS VIA PORTALS --- */}
      {isSaleModalOpen &&
        createPortal(
          <SaleModal
            isOpen={isSaleModalOpen}
            onClose={() => setIsSaleModalOpen(false)}
            salePointId={id}
            refreshData={fetchDetails}
          />,
          document.body,
        )}

      {isVersementModalOpen &&
        createPortal(
          <AddVersementClient
            isOpen={isVersementModalOpen}
            onClose={() => {
              setIsVersementModalOpen(false);
              setSelectedClient(null);
            }}
            client={selectedClient}
            salePointId={id}
            onSuccess={() => {
              fetchDetails();
              setRefreshKey((prev) => prev + 1);
            }}
          />,
          document.body,
        )}
    </div>
  );
};

export default SalesDetails;
