import React, { useState, useEffect } from "react";
import {
  Package,
  Calendar,
  Store,
  Hash,
  ChevronRight,
  Eye,
} from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";
import AchatActionsModal from "./AchatActionsModal"; // Nouveau composant

const AllSuplierAchat = ({ supplierId }) => {
  const [achats, setAchats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAchat, setSelectedAchat] = useState(null);

  const fetchAchats = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(API_PATHS.ACHATS.GET_ALL);
      const filtered = res.data.data.filter(
        (a) => (a.supplier?._id || a.supplier) === supplierId,
      );
      setAchats(filtered);
    } catch (err) {
      toast.error("Erreur lors de la récupération des achats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchats();
  }, [supplierId]);

  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse text-slate-400 font-black uppercase text-[10px] tracking-widest">
        Chargement de l'historique...
      </div>
    );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {achats.length === 0 ? (
        <div className="bg-white rounded-[30px] p-20 text-center border-2 border-dashed border-slate-100">
          <Package className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            Aucun achat enregistré pour ce partenaire
          </p>
        </div>
      ) : (
        achats.map((achat) => (
          <div
            key={achat._id}
            onClick={() => setSelectedAchat(achat)}
            className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center font-black">
                  <Hash size={18} />
                </div>
                <div>
                  <h4 className="font-black text-[#202042] text-sm uppercase">
                    Achat #{achat._id.slice(-6).toUpperCase()}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                      <Calendar size={12} />{" "}
                      {new Date(achat.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase">
                      <Store size={12} />{" "}
                      {achat.destinedStore?.name || "Boutique"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                    Montant Total
                  </p>
                  <p className="text-lg font-black text-emerald-500">
                    {achat.totalAmount?.toLocaleString()}{" "}
                    <span className="text-xs">FCFA</span>
                  </p>
                </div>
                <div className="h-10 w-[1px] bg-slate-100" />
                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-[#202042] group-hover:text-white transition-all">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Modal de détails et actions */}
      {selectedAchat && (
        <AchatActionsModal
          achat={selectedAchat}
          onClose={() => setSelectedAchat(null)}
          onRefresh={fetchAchats}
        />
      )}
    </div>
  );
};

export default AllSuplierAchat;
