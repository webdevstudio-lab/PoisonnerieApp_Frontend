import React from "react";
import { AlertCircle } from "lucide-react";

const StockAlerts = ({ alerts }) => (
  <div className="bg-white p-8 rounded-[45px] shadow-sm border border-white h-full">
    <div className="flex items-center gap-3 mb-8">
      <div className="bg-rose-50 text-rose-500 p-2 rounded-xl">
        <AlertCircle size={20} />
      </div>
      <h3 className="text-lg font-black text-[#202042]">Alertes Stock</h3>
    </div>
    <div className="space-y-4">
      {alerts.length > 0 ? (
        alerts.map((item, i) => (
          <div
            key={i}
            className="p-4 bg-slate-50 rounded-[22px] border border-slate-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-black text-sm text-[#202042]">
                  {item.produit}
                </p>
                <p className="text-[10px] text-[#3498DB] font-bold uppercase">
                  {item.boutique}
                </p>
              </div>
              <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                {item.quantite} ctn
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-slate-400 text-sm py-10">
          Aucune alerte critique
        </p>
      )}
    </div>
  </div>
);
export default StockAlerts;
