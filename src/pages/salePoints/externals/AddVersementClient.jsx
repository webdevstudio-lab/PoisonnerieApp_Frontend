import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Wallet, CheckCircle2, Loader2 } from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";

const AddVersementClient = ({
  isOpen,
  onClose,
  client,
  salePointId, // Cet ID doit correspondre à l'ID d'un document "Sale" en BDD
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "ESPECES",
    paymentDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  if (!isOpen || !client) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de sécurité
    if (!salePointId) {
      return toast.error("Erreur de configuration : ID Boutique manquant.");
    }

    try {
      setLoading(true);

      // Préparation du payload conforme au backend
      const payload = {
        clientId: client._id,
        saleId: salePointId, // Changé de salePointId à saleId pour correspondre au contrôleur
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        paymentDate: formData.paymentDate,
        notes: formData.notes,
      };

      const res = await API.post(API_PATHS.VERSEMENTS_CLIENTS.CREATE, payload);

      if (res.data.success) {
        toast.success("Versement enregistré avec succès !");

        // Réinitialisation du formulaire
        setFormData({
          amount: "",
          paymentMethod: "ESPECES",
          paymentDate: new Date().toISOString().split("T")[0],
          notes: "",
        });

        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Erreur versement:", err);
      toast.error(
        err.response?.data?.message ||
          "Une erreur est survenue lors du versement",
      );
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay avec flou */}
      <div
        className="absolute inset-0 bg-[#202042]/40 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Conteneur Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Sombre */}
        <div className="bg-[#202042] p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Wallet size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black">Nouveau Versement</h2>
              <p className="text-xs text-blue-300 uppercase tracking-wider font-bold">
                Client: {client.name}
              </p>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl flex justify-between items-center border border-white/10">
            <span className="text-sm">Dette actuelle :</span>
            <span className="text-lg font-black text-amber-400">
              {client.currentDebt?.toLocaleString()} FCFA
            </span>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              Montant à verser (FCFA)
            </label>
            <input
              required
              type="number"
              min="1"
              max={client.currentDebt} // Optionnel : limite le versement à la dette
              placeholder="0.00"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-2xl p-4 text-2xl font-black text-[#202042] outline-none transition-all"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Mode de paiement
              </label>
              <select
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl font-bold text-[#202042] outline-none appearance-none"
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value })
                }
              >
                <option value="ESPECES">Espèces</option>
                <option value="WAVE">Wave</option>
                <option value="ORANGE_MONEY">Orange Money</option>
                <option value="MOOV_MONEY">Moov Money</option>
                <option value="VIREMENT">Virement</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Date du paiement
              </label>
              <input
                type="date"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl font-bold text-[#202042] outline-none"
                value={formData.paymentDate}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              Notes / Référence (Optionnel)
            </label>
            <input
              type="text"
              placeholder="Ex: Reçu n°123, paiement solde..."
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl text-sm font-medium outline-none"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.amount}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-5 rounded-3xl font-black uppercase tracking-widest flex justify-center items-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <CheckCircle2 size={20} />
            )}
            Confirmer le versement
          </button>
        </form>
      </div>
    </div>,
    document.body, // Rendu direct dans le body via Portal
  );
};

export default AddVersementClient;
