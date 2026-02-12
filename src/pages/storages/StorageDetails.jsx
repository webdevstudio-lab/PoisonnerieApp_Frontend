import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createPortal } from "react-dom"; // Import indispensable pour le Portal
import { RefreshCcw } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Imports des composants mis à jour
import StockTable from "./externals/StockTable";
import TransferModal from "./externals/TransferModal";
import LossModal from "./externals/LossModal";
import StorageHeader from "./externals/StorageHeader";

const StorageDetails = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_PATHS.STORES.GET_ONE.replace(":id", id));
      if (res.data.success) setStore(res.data.data);
    } catch (err) {
      console.error("Erreur détails stock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreDetails();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <RefreshCcw className="animate-spin text-indigo-500" size={40} />
        <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">
          Analyse des casiers...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* 1. HEADER : Contient maintenant le titre, les actions ET les KPIs financiers */}
      <StorageHeader
        store={store}
        onTransfer={() => setActiveModal("transfer")}
        onLoss={() => setActiveModal("loss")}
      />

      {/* 2. TABLEAU D'INVENTAIRE : Juste en dessous du header */}
      <div className="grid grid-cols-1 gap-6">
        <StockTable
          items={store?.items || []}
          refreshData={fetchStoreDetails}
        />
      </div>

      {/* --- 3. SYSTEME DE MODALS (Via React Portal) --- */}
      {activeModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Background sombre et flou */}
            <div
              className="fixed inset-0 bg-[#202042]/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setActiveModal(null)}
            />

            {/* Conteneur du Modal */}
            <div className="relative w-full max-w-lg z-10 animate-in zoom-in-95 duration-200">
              {activeModal === "transfer" && (
                <TransferModal
                  sourceStore={store}
                  onClose={() => setActiveModal(null)}
                  refreshData={fetchStoreDetails}
                />
              )}
              {activeModal === "loss" && (
                <LossModal
                  store={store}
                  onClose={() => setActiveModal(null)}
                  refreshData={fetchStoreDetails}
                />
              )}
            </div>
          </div>,
          document.body, // Rendu direct dans le body
        )}
    </div>
  );
};

export default StorageDetails;
