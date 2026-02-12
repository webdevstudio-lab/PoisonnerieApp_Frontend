import React from "react";
import {
  ArrowLeft,
  ArrowRightLeft,
  AlertTriangle,
  Warehouse,
  Wallet,
  Tag,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StorageHeader = ({ store, onTransfer, onLoss }) => {
  const navigate = useNavigate();
  const isPrincipal = store?.type === "principal";

  // Calculs financiers sécurisés
  const totalPurchase =
    store?.items?.reduce((acc, item) => {
      const price = item.product?.purchasePrice || 0; // Récupère le nouveau champ
      const qty = item.quantityCartons || 0;
      return acc + qty * price;
    }, 0) || 0;

  const totalSelling =
    store?.items?.reduce((acc, item) => {
      const price = item.product?.sellingPrice || 0;
      const qty = item.quantityCartons || 0;
      return acc + qty * price;
    }, 0) || 0;

  const grossProfit = totalSelling - totalPurchase;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Barre de Navigation et Titre */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 hover:scale-105 transition-all"
          >
            <ArrowLeft size={20} className="text-[#202042]" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-[#202042] tracking-tight uppercase">
                {store?.name || "Chargement..."}
              </h1>
              <span
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                  isPrincipal
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {store?.type}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
              <Warehouse size={14} className="text-indigo-400" />
              Dépôt rattaché à{" "}
              <span className="text-[#202042] font-bold">
                {store?.salePoint?.name || "N/A"}
              </span>
            </p>
          </div>
        </div>

        {/* Boutons d'Actions Rapides */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLoss}
            className="group px-6 py-4 bg-rose-50 text-rose-500 rounded-[22px] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-rose-500 hover:text-white transition-all active:scale-95"
          >
            <AlertTriangle size={18} className="group-hover:animate-bounce" />
            Déclarer Perte
          </button>
          <button
            onClick={onTransfer}
            className="px-6 py-4 bg-[#202042] text-white rounded-[22px] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-100 hover:bg-indigo-600 transition-all active:scale-95"
          >
            <ArrowRightLeft size={18} />
            Transférer Stock
          </button>
        </div>
      </div>

      {/* Tableau de Bord Financier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* VALEUR ACHAT */}
        <div
          className={`relative overflow-hidden bg-white p-6 rounded-[35px] border border-white shadow-sm flex items-center gap-5 transition-all ${!isPrincipal ? "opacity-40 grayscale pointer-events-none" : "hover:shadow-md"}`}
        >
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <Wallet size={24} />
          </div>
          <div className="z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Valeur d'Achat Total
            </p>
            <p className="text-xl font-black text-[#202042]">
              {isPrincipal ? `${totalPurchase.toLocaleString()} F` : "---"}
            </p>
          </div>
          {!isPrincipal && (
            <LayoutDashboard
              size={60}
              className="absolute -right-4 -bottom-4 text-slate-100"
            />
          )}
        </div>

        {/* VALEUR VENTE */}
        <div className="bg-white p-6 rounded-[35px] border border-white shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Valeur de Vente
            </p>
            <p className="text-xl font-black text-[#202042]">
              {totalSelling.toLocaleString()} <span className="text-xs">F</span>
            </p>
          </div>
        </div>

        {/* BENEFICE BRUT */}
        <div
          className={`relative overflow-hidden bg-white p-6 rounded-[35px] border border-white shadow-sm flex items-center gap-5 transition-all ${!isPrincipal ? "opacity-40 grayscale pointer-events-none" : "hover:shadow-md"}`}
        >
          <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div className="z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Bénéfice Brut Estimé
            </p>
            <p
              className={`text-xl font-black ${grossProfit >= 0 ? "text-[#202042]" : "text-rose-500"}`}
            >
              {isPrincipal ? `${grossProfit.toLocaleString()} F` : "---"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageHeader;
