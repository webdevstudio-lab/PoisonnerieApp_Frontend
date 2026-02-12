import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

// CORRECTION : Ajout de l'import de l'instance API
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const DeleteCategory = ({ data, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    // Sécurité au cas où data._id serait manquant
    if (!data?._id) return toast.error("ID de catégorie introuvable");

    setLoading(true);
    const deleteToast = toast.loading("Suppression...");

    try {
      // Utilisation du chemin dynamique avec .replace()
      await API.delete(
        API_PATHS.CATEGORIES_DEPENSES.DELETE.replace(":id", data._id),
      );

      toast.success("Supprimé avec succès", { id: deleteToast });

      onSuccess(); // Rafraîchit la liste parente
      onClose(); // Ferme la modale
    } catch (err) {
      console.error("Delete error:", err);

      // CORRECTION : Récupération du message d'erreur envoyé par ton backend
      // (ex: "Impossible de supprimer : cette catégorie est liée à des dépenses existantes.")
      const errorMessage =
        err.response?.data?.message || "Erreur lors de la suppression";

      toast.error(errorMessage, { id: deleteToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-rose-500/10 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white p-8 rounded-[35px] w-full max-w-sm shadow-2xl text-center border border-rose-100 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} />
        </div>

        <h3 className="font-black uppercase text-[#202042] text-lg mb-2 italic tracking-tighter">
          Supprimer ?
        </h3>

        <p className="text-[10px] font-bold text-slate-400 uppercase mb-8 leading-relaxed px-4">
          Voulez-vous supprimer{" "}
          <span className="text-rose-500 font-black">"{data?.name}"</span> ?
          <br />
          Cette action est irréversible.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-rose-200 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
          >
            {loading ? "Suppression en cours..." : "Confirmer la suppression"}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-4 text-slate-400 font-black text-[10px] uppercase hover:text-slate-600 transition-colors disabled:opacity-30"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategory;
