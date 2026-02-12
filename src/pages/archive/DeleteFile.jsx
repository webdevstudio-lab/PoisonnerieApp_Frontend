import React, { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const DeleteFile = ({ file, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Correction de l'URL avec le chemin dynamique :id
      const url = API_PATHS.ARCHIVES.DELETE.replace(":id", file._id);
      await API.delete(url);
      toast.success("Supprimé avec succès");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Impossible de supprimer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#202042]/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-white w-[450px] rounded-[40px] shadow-2xl p-8 text-center border border-white">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[30px] flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} />
        </div>
        <h2 className="text-xl font-black text-[#202042] uppercase mb-2">
          Supprimer ?
        </h2>
        <p className="text-sm font-bold text-slate-400 px-4">
          Voulez-vous supprimer{" "}
          <span className="text-rose-500">"{file?.name}"</span> ?
        </p>

        <div className="mt-10 flex w-full gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-xs font-black uppercase text-slate-400"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Trash2 size={16} /> Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFile;
