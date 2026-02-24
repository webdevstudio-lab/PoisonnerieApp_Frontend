import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Package,
  AlertCircle,
  User,
} from "lucide-react";

const StockMovement = ({ movements = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case "transfert":
        return <ArrowDownLeft size={18} className="text-emerald-500" />;
      case "retour":
        return <ArrowUpRight size={18} className="text-amber-500" />;
      case "perte":
        return <AlertCircle size={18} className="text-rose-500" />;
      default:
        return <Package size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="bg-white p-5 lg:p-8 rounded-[30px] lg:rounded-[40px] shadow-sm border border-slate-50 flex flex-col h-[500px] lg:h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div>
          <h3 className="text-base lg:text-lg font-black text-[#202042]">
            Flux de Stock
          </h3>
          <p className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-tighter">
            Historique des opérations
          </p>
        </div>
      </div>

      {/* ZONE DE SCROLL */}
      <div className="space-y-3 lg:space-y-4 overflow-y-auto pr-1 custom-scrollbar">
        {movements.length > 0 ? (
          movements.map((move) => (
            <div
              key={move._id}
              className="p-3 lg:p-4 rounded-[20px] lg:rounded-[24px] border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 lg:gap-4">
                <div className="flex items-start gap-3 lg:gap-4 w-full">
                  {/* Icône de type */}
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(move.type)}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    {/* Produit */}
                    <p className="font-black text-[#202042] text-xs lg:text-sm uppercase truncate">
                      {move.product?.name || "Produit inconnu"}
                    </p>

                    {/* Description complète */}
                    <p className="text-[10px] lg:text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2 lg:line-clamp-none">
                      {move.description}
                    </p>

                    {/* Meta data: Date & Utilisateur */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                      <div className="flex items-center gap-1.5 text-[8px] lg:text-[9px] text-slate-400 font-bold uppercase">
                        <Clock size={10} className="lg:w-3 lg:h-3" />
                        {new Date(move.date).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-[8px] lg:text-[9px] text-blue-400 font-bold uppercase">
                        <User size={10} className="lg:w-3 lg:h-3" />
                        {move.userId?.name || "Système"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantité et Badge - Aligné à droite sur PC, en bas sur petit mobile */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-none border-slate-100/50 shrink-0">
                  <p className="font-black text-xs lg:text-sm text-[#202042]">
                    {move.quantity}{" "}
                    <span className="text-[10px]">
                      Carton{move.quantity > 1 ? "s" : ""}
                    </span>
                  </p>
                  <span
                    className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${
                      move.type === "transfert"
                        ? "bg-emerald-100 text-emerald-600"
                        : move.type === "perte"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {move.type}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-slate-400 font-bold text-sm">
            Aucun mouvement enregistré
          </div>
        )}
      </div>

      {/* Indicateur visuel */}
      {movements.length > 4 && (
        <p className="text-center text-[8px] lg:text-[9px] font-black text-slate-300 uppercase mt-auto pt-4 tracking-widest">
          Faites défiler pour voir plus
        </p>
      )}

      {/* Style Global pour la scrollbar personnalisé */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        @media (min-width: 1024px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default StockMovement;
