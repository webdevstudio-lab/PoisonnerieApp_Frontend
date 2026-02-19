import React, { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";

export const ConfirmDeleteModal = ({ versement, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      // Remplace l'ID dans le chemin de l'API
      const url = API_PATHS.VERSEMENTS.DELETE.replace(":id", versement._id);
      const res = await API.delete(url);

      if (res.data.success) {
        toast.success("Versement annulé avec succès");
        // APPEL DE L'ACTUALISATION : Ferme la modale ET rafraîchit la liste dans VersementList
        onSuccess();
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
      toast.error(
        err.response?.data?.message || "Erreur lors de la suppression",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Icône d'alerte */}
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[25px] flex items-center justify-center mx-auto">
        <AlertTriangle size={40} strokeWidth={2.5} />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-black text-[#202042]">Confirmation</h3>
        <p className="text-slate-400 text-sm font-medium leading-relaxed">
          Êtes-vous sûr de vouloir supprimer le versement de <br />
          <span className="text-[#202042] font-black">
            {versement.amount?.toLocaleString()} F
          </span>{" "}
          ?
        </p>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-100">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
          Conséquence
        </p>
        <p className="text-[11px] text-red-400 font-bold mt-1">
          Cette action est irréversible et modifiera les soldes boutique et
          caisse.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 py-4 text-slate-400 font-black text-xs hover:bg-slate-50 rounded-2xl transition-all"
        >
          ANNULER
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-[20px] font-black text-xs shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <Trash2 size={16} />
              OUI, SUPPRIMER
            </>
          )}
        </button>
      </div>
    </div>
  );
};
