import React, { useState, useEffect } from "react";
import { History, Download } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths"; // Utilise tes constantes !

const TransactionHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Correction de l'URL pour correspondre au backend : /api/caisse/historique
        const res = await API.get(API_PATHS.CAISSE.GET_HISTORIQUE);

        if (res.data.success) {
          // Ton backend renvoie { historique, pagination } dans data
          setData(res.data.data.historique || []);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'historique:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading)
    return <div className="p-8 text-center text-slate-400">Chargement...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History size={20} className="text-[#202042]" />
          <span className="font-black text-[#202042] uppercase text-sm">
            Tous les mouvements
          </span>
        </div>
        <button className="text-slate-400 hover:text-[#3498DB]">
          <Download size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Date
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Détails
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Montant
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? (
              data.map((t) => (
                <tr
                  key={t._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-5 text-sm font-bold text-slate-500">
                    {/* Utilisation de createdAt car défini dans ton modèle backend */}
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 italic text-slate-400 text-sm">
                    {t.description}
                    <div className="text-[10px] font-bold text-slate-300 uppercase not-italic">
                      {t.categorie}
                    </div>
                  </td>
                  <td
                    className={`px-8 py-5 text-sm font-black text-right ${
                      t.type === "ENTREE" ? "text-[#2ECC71]" : "text-rose-500"
                    }`}
                  >
                    {t.type === "ENTREE" ? "+" : "-"}{" "}
                    {t.montant?.toLocaleString()} F
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-8 py-10 text-center text-slate-400 italic"
                >
                  Aucune transaction enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
