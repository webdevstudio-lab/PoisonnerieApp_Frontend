import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  LayoutDashboard,
  ShoppingBag,
  Receipt,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

import SalesStats from "./externals/SalesStats";
import TopProducts from "./externals/TopProducts";
import StockMovement from "./externals/StockMovement";
import FinancialSummary from "./externals/FinancialSummary";
import SaleModal from "./externals/SaleModal";
import VenteDetails from "./externals/VenteDetails";
import VersementDetail from "./externals/VersementDetail";

const SalesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- GESTION DES ONGLETS VIA URL ---
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Clé pour forcer le rafraîchissement des composants enfants (Stats, etc.)
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDetails = useCallback(async () => {
    try {
      // Pas de setLoading(true) ici pour éviter le flash blanc lors d'un refresh après vente
      const res = await API.get(API_PATHS.SALES.GET_ONE.replace(":id", id));
      if (res.data.success) {
        setData(res.data.data);
        // On incrémente la clé pour notifier les composants comme SalesStats de recharger
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

  if (loading)
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#3498DB] rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">
          Chargement du point de vente...
        </p>
      </div>
    );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 font-bold hover:text-[#202042] transition-colors"
        >
          <ArrowLeft size={20} /> Retour
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#3498DB] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus size={18} /> Nouvelle Vente
          </button>
        </div>
      </div>

      {/* Barre d'Onglets Style Moderne */}
      <div className="flex gap-2 bg-slate-100/50 p-1.5 rounded-[22px] w-fit border border-slate-100">
        <button
          onClick={() => handleTabChange("dashboard")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === "dashboard"
              ? "bg-white text-[#202042] shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <LayoutDashboard size={18} /> Vue d'ensemble
        </button>

        <button
          onClick={() => handleTabChange("sales")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === "sales"
              ? "bg-white text-[#202042] shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <ShoppingBag size={18} /> Historique Ventes
        </button>

        <button
          onClick={() => handleTabChange("payments")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === "payments"
              ? "bg-white text-[#202042] shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Receipt size={18} /> Versements
        </button>
      </div>

      <hr className="border-slate-100" />

      {/* Rendu Conditionnel avec animations */}
      <div className="min-h-[500px]">
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="lg:col-span-2 space-y-8">
              {/* Correction majeure : Passage du salePointId et de la refreshKey */}
              <SalesStats salePointId={id} key={`stats-${refreshKey}`} />
              <StockMovement movements={data?.history} />
            </div>
            <div className="space-y-8">
              <FinancialSummary
                solde={data?.solde}
                secondaryStore={data?.secondaryStore}
              />
              <TopProducts products={data?.secondaryStore?.items} />
            </div>
          </div>
        )}

        {activeTab === "sales" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <VenteDetails salePointId={id} />
          </div>
        )}

        {activeTab === "payments" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <VersementDetail salePointId={id} />
          </div>
        )}
      </div>

      {/* Modal de vente */}
      <SaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        salePointId={id}
        refreshData={fetchDetails} // Cette fonction mettra à jour data + refreshKey
      />
    </div>
  );
};

export default SalesDetails;
