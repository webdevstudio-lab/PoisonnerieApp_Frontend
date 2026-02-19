import React, { useState, useEffect } from "react";
import { Wallet, TrendingUp, TrendingDown, Plus, X } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { createPortal } from "react-dom";

// Imports des composants d'onglets
import TransactionHistory from "./TransactionHistory";
import VersementList from "./VersementList";
import ApportList from "./ApportList";
import RetraitList from "./RetraitList";

// Import des Modales (Formulaires)
import VersementModal from "./modals/VersementModal";
import ApportModal from "./modals/ApportModal"; // À créer sur le même modèle
import RetraitModal from "./modals/RetraitModal"; // À créer sur le même modèle

const Caisse = () => {
  const [data, setData] = useState({
    soldeActuel: 0,
    totalEntrees: 0,
    totalSorties: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [modalType, setModalType] = useState(null);

  // Fonction pour charger les données de la caisse
  const fetchCaisseData = async () => {
    try {
      setLoading(true);
      // Utilisation du chemin GET_SOLDE
      const res = await API.get(API_PATHS.CAISSE.GET_SOLDE);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du solde:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaisseData();
  }, []);

  const tabs = [
    { id: "all", label: "Historique Global" },
    { id: "versements", label: "Versements Boutiques" },
  ];

  const closeModal = () => setModalType(null);

  // Callback après une opération réussie
  const handleActionSuccess = () => {
    fetchCaisseData(); // Rafraîchir les stats (Solde, Entrées, Sorties)
    closeModal();
    // Optionnel : Forcer le rafraîchissement de l'onglet actif si nécessaire
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-black text-slate-400 uppercase tracking-widest">
        Synchronisation de la trésorerie...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#202042] tracking-tight">
            Caisse Générale
          </h1>
          <p className="text-slate-400 font-medium italic">
            Portefeuille Gérant & Flux de Trésorerie
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setModalType("versement")}
            className="bg-[#3498DB] text-white px-6 py-4 rounded-[22px] font-black text-xs uppercase flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Plus size={18} /> Versement
          </button>
          <button
            onClick={() => setModalType("apport")}
            className="bg-[#2ECC71] text-white px-6 py-4 rounded-[22px] font-black text-xs uppercase flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <TrendingUp size={18} /> Apport
          </button>
          <button
            onClick={() => setModalType("retrait")}
            className="bg-rose-500 text-white px-6 py-4 rounded-[22px] font-black text-xs uppercase flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <TrendingDown size={18} /> Retrait
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#202042] rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl">
          <div className="relative z-10">
            <p className="text-blue-300/60 font-black uppercase text-[10px] tracking-[0.2em] mb-2">
              Solde Actuel
            </p>
            <h2 className="text-4xl font-black text-[#2ECC71] mb-4">
              {data.soldeActuel?.toLocaleString()}{" "}
              <span className="text-lg font-bold">F</span>
            </h2>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Wallet size={24} className="text-blue-300" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-2 text-center md:text-left">
            Entrées Totales
          </p>
          <h2 className="text-3xl font-black text-[#2ECC71] mb-2 text-center md:text-left">
            +{data.totalEntrees?.toLocaleString()} F
          </h2>
        </div>

        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-2 text-center md:text-left">
            Sorties Totales
          </p>
          <h2 className="text-3xl font-black text-rose-500 mb-2 text-center md:text-left">
            -{data.totalSorties?.toLocaleString()} F
          </h2>
        </div>
      </div>

      {/* SECTION ONGLETS MODERNE */}
      <div className="space-y-6">
        <div className="flex gap-2 bg-slate-100/50 p-1.5 rounded-[25px] w-fit border border-slate-100 overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-[18px] font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-[#202042] shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[40px] border border-white shadow-sm overflow-hidden min-h-[400px]">
          {activeTab === "all" && <TransactionHistory />}
          {activeTab === "versements" && <VersementList />}
          {activeTab === "apports" && <ApportList />}
          {activeTab === "retraits" && <RetraitList />}
        </div>
      </div>

      {/* MODAL PORTAL (S'affiche par-dessus tout le DOM) */}
      {modalType &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay flouté */}
            <div
              className="absolute inset-0 bg-[#202042]/40 backdrop-blur-md animate-in fade-in duration-300"
              onClick={closeModal}
            />
            {/* Conteneur Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-300">
              {/* Bouton Fermer icône */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-8 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <X size={24} strokeWidth={3} />
              </button>

              {/* Injection dynamique du bon formulaire */}
              {modalType === "versement" && (
                <VersementModal onSuccess={handleActionSuccess} />
              )}
              {modalType === "apport" && (
                <ApportModal onSuccess={handleActionSuccess} />
              )}
              {modalType === "retrait" && (
                <RetraitModal onSuccess={handleActionSuccess} />
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Caisse;
