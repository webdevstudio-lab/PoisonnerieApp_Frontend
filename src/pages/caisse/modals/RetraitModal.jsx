import React, { useState } from "react";
import { TrendingDown, DollarSign, AlignLeft, AlertCircle } from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const RetraitModal = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    montant: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post(API_PATHS.CAISSE.RETRAIT, formData);
      if (res.data.success) {
        onSuccess();
      }
    } catch (err) {
      // Ton contrôleur renvoie l'erreur "Solde insuffisant" ici
      alert(err.response?.data?.message || "Erreur lors du retrait");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#202042] uppercase">
          Nouveau Retrait
        </h2>
        <p className="text-slate-400 text-xs font-bold italic">
          Sortie d'argent de la caisse centrale
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2">
            <DollarSign size={12} /> Montant à retirer
          </label>
          <input
            type="number"
            required
            className="w-full bg-slate-50 border-none rounded-[22px] px-6 py-4 text-sm font-bold text-[#202042] outline-none focus:ring-2 focus:ring-rose-100 transition-all"
            placeholder="0"
            value={formData.montant}
            onChange={(e) =>
              setFormData({ ...formData, montant: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2">
            <AlignLeft size={12} /> Motif / Bénéficiaire
          </label>
          <textarea
            required
            className="w-full bg-slate-50 border-none rounded-[22px] px-6 py-4 text-sm font-bold text-[#202042] outline-none resize-none"
            rows="3"
            placeholder="Ex: Paiement facture électricité ou Retrait gérant..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </div>

      <div className="bg-rose-50 p-4 rounded-2xl flex items-start gap-3 border border-rose-100">
        <AlertCircle className="text-rose-500 shrink-0" size={18} />
        <p className="text-[10px] text-rose-600 font-bold leading-relaxed uppercase">
          Attention : Cette action est irréversible et sera enregistrée dans
          l'historique permanent.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white py-5 rounded-[22px] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? (
          "TRAITEMENT..."
        ) : (
          <>
            <TrendingDown size={18} /> VALIDER LE RETRAIT
          </>
        )}
      </button>
    </form>
  );
};

export default RetraitModal;
