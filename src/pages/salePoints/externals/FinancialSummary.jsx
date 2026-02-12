import React from "react";
import {
  Wallet,
  Users,
  ArrowUpRight,
  ShoppingBag,
  BarChart3,
} from "lucide-react";

const FinancialSummary = ({ solde = 0, secondaryStore = null }) => {
  // Calcul de la valeur totale du stock (Prix de vente estimé)
  const stockValue =
    secondaryStore?.items?.reduce((acc, item) => {
      // D'après ton JSON, la clé est 'sellingPrice'
      // On s'assure que product est un objet et possède le prix
      const price = item.product?.sellingPrice || 0;
      const quantity = item.quantityCartons || 0;

      return acc + quantity * price;
    }, 0) || 0;

  return (
    <div className="space-y-6">
      {/* 1. SOLDE DE CAISSE */}
      <div className="bg-white p-6 rounded-[35px] border border-slate-50 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
          <Wallet size={80} />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
          Solde de Caisse
        </p>
        <h4 className="text-4xl font-black text-[#202042] tabular-nums">
          {solde.toLocaleString()}{" "}
          <span className="text-sm text-slate-400 font-bold">FCFA</span>
        </h4>
        <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-xs">
          <ArrowUpRight size={16} /> En direct du point de vente
        </div>
      </div>

      {/* 2. VALEUR DU STOCK SECONDAIRE */}
      <div className="bg-blue-50/50 p-6 rounded-[35px] border border-blue-100 shadow-sm relative overflow-hidden group">
        <div className="absolute right-[-10px] top-[-10px] p-6 opacity-10 text-blue-600 group-hover:rotate-12 transition-transform">
          <ShoppingBag size={60} />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
            <BarChart3 size={20} />
          </div>
          <h4 className="font-black text-[#202042]">Valeur du Stock</h4>
        </div>
        <p className="text-2xl font-black text-blue-600 mb-1 tabular-nums">
          {stockValue.toLocaleString()}{" "}
          <span className="text-sm opacity-60">FCFA</span>
        </p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
          Estimation basée sur {secondaryStore?.items?.length || 0} références
        </p>
      </div>

      {/* 3. IMPAYÉS (Logique de dettes si applicable) */}
      <div className="bg-rose-50/50 p-6 rounded-[35px] border border-rose-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
            <Users size={20} />
          </div>
          <h4 className="font-black text-[#202042]">Impayés</h4>
        </div>
        <p className="text-2xl font-black text-rose-600 mb-2">0 FCFA</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase">
          Aucune dette enregistrée
        </p>
      </div>
    </div>
  );
};

export default FinancialSummary;
