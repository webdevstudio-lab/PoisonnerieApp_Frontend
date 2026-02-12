import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const DeleteStore = ({ store, onClose, refreshData }) => {
  const [loading, setLoading] = useState(false);

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const res = await API.delete(
        API_PATHS.STORES.DELETE_ONE.replace(":id", store._id),
      );
      if (res.data.success) {
        toast.success("Dépôt supprimé");
        refreshData();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de suppression");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] text-center">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[30px] flex items-center justify-center mx-auto mb-6">
        <AlertTriangle size={40} />
      </div>
      <h3 className="text-xl font-black text-[#202042] mb-2">
        Supprimer le dépôt ?
      </h3>
      <p className="text-slate-400 text-sm mb-8">
        L'entrepôt <span className="font-bold text-rose-500">{store.name}</span>{" "}
        sera définitivement retiré.
        <br />
        <span className="text-[10px] italic">
          Note: Le dépôt doit être vide pour être supprimé.
        </span>
      </p>
      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-[10px] uppercase"
        >
          Annuler
        </button>
        <button
          onClick={confirmDelete}
          disabled={loading}
          className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default DeleteStore;
