import React, { useState } from "react";
import { createPortal } from "react-dom"; // Import indispensable
import toast from "react-hot-toast";
import { API_PATHS } from "../../../utils/apiPaths";
import API from "../../../utils/axiosInstance";

const AddCategory = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Le nom est requis");

    setLoading(true);
    const loadToast = toast.loading("Création...");

    try {
      await API.post(API_PATHS.CATEGORIES_DEPENSES.CREATE, {
        name: name.trim(),
      });

      toast.success("Catégorie ajoutée", { id: loadToast });
      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Erreur lors de la création";
      toast.error(errorMsg, { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  // Rendu via Portal
  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[100000] bg-[#0f0f2d]/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Overlay pour fermer au clic à l'extérieur du petit formulaire */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#202042] p-8 rounded-[35px] w-full max-w-sm shadow-2xl border border-white/5 relative z-10 animate-in zoom-in-95 duration-200"
      >
        <h3 className="text-white font-black uppercase text-sm mb-6 italic tracking-widest">
          Nouveau Label
        </h3>

        <div className="space-y-2 mb-6">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
            Nom de la catégorie
          </label>
          <input
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-[#61b4f7] focus:ring-1 focus:ring-[#61b4f7]/30 uppercase text-[11px] transition-all placeholder:text-slate-600"
            placeholder="EX: TRANSPORT, LOISIRS..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase hover:text-white transition-colors"
          >
            Annuler
          </button>

          <button
            disabled={loading || !name.trim()}
            type="submit"
            className="flex-[2] py-4 bg-[#61b4f7] text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Chargement...
              </>
            ) : (
              "Confirmer"
            )}
          </button>
        </div>
      </form>
    </div>,
    document.body, // Injection directe dans le body pour ignorer la hiérarchie CSS
  );
};

export default AddCategory;
