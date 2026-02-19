import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { RefreshCcw } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

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
      // On s'assure que le backend peuple (populate) bien les détails du produit pour avoir le purchasePrice
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

  /**
   * CALCUL DE LA VALEUR TOTALE DU STOCK (PRIX D'ACHAT)
   * useMemo permet de ne pas recalculer si le store ne change pas.
   */
  const totalPurchaseValue = useMemo(() => {
    if (!store || !store.items) return 0;

    return store.items.reduce((acc, item) => {
      // On récupère le prix d'achat depuis l'objet produit peuplé
      const price = item.product?.purchasePrice || 0;
      const quantity = item.quantityCartons || 0;
      return acc + price * quantity;
    }, 0);
  }, [store]);

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
      {/* On passe totalPurchaseValue au Header pour qu'il puisse 
         l'afficher dans les KPIs financiers 
      */}
      <StorageHeader
        store={store}
        totalValue={totalPurchaseValue}
        onTransfer={() => setActiveModal("transfer")}
        onLoss={() => setActiveModal("loss")}
      />

      <div className="grid grid-cols-1 gap-6">
        <StockTable
          items={store?.items || []}
          refreshData={fetchStoreDetails}
        />
      </div>

      {/* --- SYSTEME DE MODALS (Portal) --- */}
      {activeModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-[#202042]/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setActiveModal(null)}
            />

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
          document.body,
        )}
    </div>
  );
};

export default StorageDetails;
