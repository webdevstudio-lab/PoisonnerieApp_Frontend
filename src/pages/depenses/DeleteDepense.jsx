import React, { useState } from "react";
import { createPortal } from "react-dom"; // Import du Portal
import API from "../../utils/axiosInstance";
import { AlertTriangle, X } from "lucide-react";
import toast from "react-hot-toast";

const DeleteDepense = ({ data, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  // Sécurité : si aucune donnée n'est passée, on ne rend rien
  if (!data) return null;

  const handleDelete = async () => {
    setLoading(true);
    const loadToast = toast.loading("Suppression en cours...");

    try {
      // On utilise l'ID passé via la prop data
      await API.delete(`/depenses/${data._id}`);

      toast.success("Dépense supprimée", { id: loadToast });
      onSuccess(); // Rafraîchir la liste
      onClose(); // Fermer la modale
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message || "Erreur lors de la suppression";
      toast.error(msg, { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  // Rendu via Portal
  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[10000] flex items-center justify-center p-6 bg-[#0f0f2d]/70 backdrop-blur-md animate-in fade-in duration-300">
      {/* Overlay cliquable pour fermer (optionnel pour une suppression) */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white w-full max-w-md rounded-[45px] p-10 shadow-2xl relative z-10 text-center animate-in zoom-in-95 duration-200">
        {/* BOUTON FERMER X */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X size={20} />
        </button>

        {/* ICONE D'ALERTE */}
        <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[30px] flex items-center justify-center mx-auto mb-8 animate-bounce">
          <AlertTriangle size={48} strokeWidth={2.5} />
        </div>

        <h2 className="text-2xl font-black text-[#202042] uppercase mb-4 italic tracking-tighter">
          Confirmation
        </h2>

        <p className="text-[12px] font-bold text-slate-400 uppercase leading-relaxed mb-10 px-4">
          Êtes-vous sûr de vouloir supprimer <br />
          <span className="text-rose-500 font-black italic">
            "{data.label || "cette dépense"}"
          </span>
          <br />
          d'un montant de{" "}
          <span className="text-[#202042]">
            {(data.amount || 0).toLocaleString()} FCFA
          </span>{" "}
          ?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading
              ? "Suppression en cours..."
              : "Oui, supprimer définitivement"}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-[11px] uppercase hover:bg-slate-200 transition-all"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>,
    document.body, // Injection directe dans le body
  );
};

export default DeleteDepense;
