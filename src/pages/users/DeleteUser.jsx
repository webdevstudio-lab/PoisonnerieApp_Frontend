import React, { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const DeleteUser = ({ user, onClose, refreshData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("Suppression en cours...");
    try {
      await API.delete(API_PATHS.USERS.DELETE_ONE.replace(":id", user._id));
      toast.success("Membre retiré de l'équipage", { id: loadingToast });
      refreshData();
      onClose();
    } catch (err) {
      toast.error("Erreur lors de la suppression", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 text-center bg-white rounded-[40px]">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[30px] flex items-center justify-center mx-auto mb-6">
        <AlertTriangle size={40} />
      </div>
      <h2 className="text-2xl font-black text-[#202042] mb-2">
        Supprimer le membre ?
      </h2>
      <p className="text-slate-400 text-sm mb-8">
        Vous êtes sur le point de supprimer{" "}
        <span className="font-bold text-[#202042]">{user.name}</span>. Cette
        action est irréversible.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest rounded-[22px] transition-all flex items-center justify-center gap-3"
        >
          {isLoading ? (
            "Suppression..."
          ) : (
            <>
              <Trash2 size={18} /> Confirmer la suppression
            </>
          )}
        </button>
        <button
          onClick={onClose}
          className="w-full py-4 bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-[22px] hover:bg-slate-200 transition-all"
        >
          Garder le membre
        </button>
      </div>
    </div>
  );
};

export default DeleteUser;
