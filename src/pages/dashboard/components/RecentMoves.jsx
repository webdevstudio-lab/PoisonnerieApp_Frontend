import React from "react";
import { History } from "lucide-react";

const RecentMoves = ({ moves }) => (
  <div className="bg-white rounded-[45px] shadow-sm overflow-hidden">
    {/* En-tête fixe */}
    <div className="p-8 flex items-center justify-between border-b border-slate-50">
      <div className="flex items-center gap-3">
        <div className="bg-blue-50 text-[#3498DB] p-2 rounded-xl">
          <History size={20} />
        </div>
        <h3 className="text-lg font-black text-[#202042]">
          Dernières Opérations Caisse
        </h3>
      </div>
    </div>

    {/* Conteneur avec Scroll Vertical */}
    <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
      <div className="overflow-x-auto">
        <table className="w-full text-left relative border-separate border-spacing-0">
          <thead className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                Type
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                Montant
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                Auteur
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {moves?.length > 0 ? (
              moves.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5 text-sm font-bold">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] ${
                        row.type === "ENTREE"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td
                    className={`px-8 py-5 font-black ${
                      row.type === "ENTREE"
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {row.montant.toLocaleString()} F
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                    {row.effectuePar?.name || "Système"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-8 py-10 text-center text-slate-400 text-sm italic"
                >
                  Aucun mouvement enregistré
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default RecentMoves;
