import React, { useState } from "react";
import { TrendingUp, DollarSign, AlignLeft, Send, Loader2 } from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";

const ApportModal = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    montant: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation locale simple
    if (!formData.montant || formData.montant <= 0) {
      return toast.error("Veuillez saisir un montant valide");
    }

    try {
      setLoading(true);

      // Appel vers votre contrôleur VersementCaisse via l'API_PATH
      const res = await API.post(API_PATHS.CAISSE.VERSEMENT, {
        montant: Number(formData.montant),
        description: formData.description,
      });

      // Votre backend utilise responseHandler.ok qui renvoie { success: true, data: ... }
      if (res.data.success) {
        toast.success(res.data.message || "Apport enregistré avec succès !");

        // Réinitialisation du formulaire
        setFormData({ montant: "", description: "" });

        // Exécution de l'action de succès (fermeture modale + refresh liste)
        onSuccess();
      }
    } catch (err) {
      console.error("Erreur Apport:", err);
      // Récupération du message d'erreur envoyé par responseHandler.error
      const errorMsg =
        err.response?.data?.message || "Erreur lors de l'opération";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-[#202042] uppercase tracking-tight">
            Nouvel Apport
          </h2>
          <p className="text-slate-400 text-xs font-bold italic mt-1">
            Injection de fonds externes (hors revenus boutiques)
          </p>
        </div>

        <div className="space-y-4">
          {/* CHAMP MONTANT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2">
              <DollarSign size={12} className="text-green-500" /> Montant à
              déposer (FCFA)
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="1"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-[22px] px-6 py-4 text-sm font-bold text-[#202042] outline-none focus:border-green-100 focus:bg-white transition-all placeholder:text-slate-300"
                placeholder="Ex: 500000"
                value={formData.montant}
                onChange={(e) =>
                  setFormData({ ...formData, montant: e.target.value })
                }
              />
            </div>
          </div>

          {/* CHAMP DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2">
              <AlignLeft size={12} className="text-blue-400" /> Motif de
              l'apport
            </label>
            <textarea
              required
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[22px] px-6 py-4 text-sm font-bold text-[#202042] outline-none focus:border-blue-100 focus:bg-white transition-all resize-none placeholder:text-slate-300"
              rows="3"
              placeholder="Ex: Apport personnel du gérant pour achat stock mobilier..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        </div>

        {/* BOUTON DE VALIDATION */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2ECC71] hover:bg-[#27ae60] text-white py-5 rounded-[22px] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-green-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              TRAITEMENT EN COURS...
            </>
          ) : (
            <>
              <TrendingUp size={18} /> CONFIRMER L'INJECTION
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ApportModal;
