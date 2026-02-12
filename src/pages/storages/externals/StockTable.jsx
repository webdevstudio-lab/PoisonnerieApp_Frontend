import React from "react";
import {
  AlertCircle,
  PackageCheck,
  ThermometerSnowflake,
  Boxes,
} from "lucide-react";

const StockTable = ({ items = [] }) => {
  return (
    <div className="bg-white rounded-[40px] border border-white shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-700 delay-150">
      {/* Header du Tableau */}
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner">
            <ThermometerSnowflake size={22} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#202042]">
              État des Congélateurs
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Inventaire temps réel
            </p>
          </div>
        </div>
        <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-tighter">
          {items.length} Références actives
        </span>
      </div>

      {/* Contenu du Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Produit
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Catégorie
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                Stock (Cartons)
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.length > 0 ? (
              items.map((item, idx) => {
                const qty = Number(item.quantityCartons || 0);
                const isLow = qty > 0 && qty < 5;
                const isCritical = qty === 0;

                return (
                  <tr
                    key={item.product?._id || idx}
                    className="hover:bg-indigo-50/20 transition-all group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500 transition-colors">
                          <Boxes size={16} />
                        </div>
                        <p className="font-bold text-[#202042] uppercase text-xs tracking-tight">
                          {item.product?.name || "Produit Inconnu"}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                        {item.product?.category || "Non classé"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`text-lg font-black ${
                            isCritical
                              ? "text-rose-500"
                              : isLow
                                ? "text-amber-500"
                                : "text-[#202042]"
                          }`}
                        >
                          {qty}
                        </span>
                        <div
                          className={`h-1 w-8 rounded-full mt-1 ${
                            isCritical
                              ? "bg-rose-100"
                              : isLow
                                ? "bg-amber-100"
                                : "bg-emerald-100"
                          }`}
                        />
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase animate-pulse">
                          <AlertCircle size={14} /> Rupture Critique
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase">
                          Réapprovisionner
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase bg-emerald-50 px-3 py-1 rounded-full">
                          <PackageCheck size={14} /> Stock Optimal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-20">
                    <Boxes size={48} />
                    <p className="font-black uppercase text-xs tracking-[0.3em]">
                      Aucun stock enregistré
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
