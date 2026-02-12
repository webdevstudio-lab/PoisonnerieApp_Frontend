import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Package,
  AlertCircle,
  User,
  Info,
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
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 flex flex-col h-150">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-[#202042]">Flux de Stock</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">
            Historique détaillé des opérations
          </p>
        </div>
      </div>

      {/* ZONE DE SCROLL : max-h-[480px] correspond environ à 6 lignes de détails */}
      <div className="space-y-4 overflow-y-auto pr-2 max-h-[480px] custom-scrollbar">
        {movements.length > 0 ? (
          movements.map((move) => (
            <div
              key={move._id}
              className="p-4 rounded-[24px] border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Icône de type */}
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(move.type)}
                  </div>

                  <div className="space-y-1">
                    {/* Produit */}
                    <p className="font-black text-[#202042] text-sm uppercase">
                      {move.product?.name || "Produit inconnu"}
                    </p>

                    {/* Description complète (le détail que tu voulais) */}
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[300px]">
                      {move.description}
                    </p>

                    {/* Meta data: Date & Utilisateur */}
                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase">
                        <Clock size={12} />
                        {new Date(move.date).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] text-blue-400 font-bold uppercase">
                        <User size={12} />
                        {move.userId?.name || "Système"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantité et Badge */}
                <div className="text-right shrink-0">
                  <p className="font-black text-sm text-[#202042]">
                    {move.quantity} Carton{move.quantity > 1 ? "s" : ""}
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

      {/* Petit indicateur visuel si scroll nécessaire */}
      {movements.length > 6 && (
        <p className="text-center text-[9px] font-black text-slate-300 uppercase mt-4 tracking-widest">
          Faites défiler pour voir plus
        </p>
      )}

      {/* CSS interne pour la scrollbar (optionnel) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default StockMovement;
