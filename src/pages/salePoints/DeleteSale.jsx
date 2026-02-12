import React, { useState } from "react";
import { Trash2, AlertCircle, X } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const DeleteSalePoint = ({ sale, onClose, refreshData }) => {
  const [loading, setLoading] = useState(false);

  const confirmDelete = async () => {
    setLoading(true);
    const loadToast = toast.loading("Fermeture du point de vente...");
    try {
      await API.delete(API_PATHS.SALES.DELETE_ONE.replace(":id", sale._id));
      toast.success("Point de vente supprimé avec succès", { id: loadToast });
      refreshData();
      onClose();
    } catch (err) {
      toast.error("Erreur : Ce point contient peut-être encore du stock", {
        id: loadToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] text-center relative">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-slate-300 hover:text-slate-500"
      >
        <X size={20} />
      </button>

      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[30px] flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={40} />
      </div>

      <h3 className="text-xl font-black text-[#202042] mb-2">
        Supprimer le point ?
      </h3>
      <p className="text-slate-400 text-sm mb-8">
        Voulez-vous vraiment supprimer{" "}
        <span className="font-bold text-[#202042]">{sale?.name}</span> ? Cette
        action est irréversible.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={confirmDelete}
          disabled={loading}
          className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-[22px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-rose-100"
        >
          {loading ? (
            "Suppression..."
          ) : (
            <>
              <Trash2 size={18} /> Confirmer la suppression
            </>
          )}
        </button>
        <button
          onClick={onClose}
          className="w-full py-4 bg-slate-100 text-slate-500 rounded-[22px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default DeleteSalePoint;
