import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus, Phone, Wallet, Save, Loader2 } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const AddClient = ({ isOpen, onClose, onRefresh }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    creditLimit: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const tid = toast.loading("Enregistrement du client...");

    try {
      await API.post(API_PATHS.CLIENTS.CREATE, formData);
      toast.success("Client ajouté avec succès", { id: tid });

      // Réinitialiser et fermer
      setFormData({ name: "", phone: "", creditLimit: 0 });
      onRefresh(); // Rafraîchir la liste des clients
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout", {
        id: tid,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#202042]/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl relative border border-white/20 animate-in zoom-in-95 duration-200">
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute right-8 top-8 text-slate-300 hover:text-rose-500 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header du Modal */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner">
            <UserPlus size={24} />
          </div>
          <h2 className="text-2xl font-black text-[#202042]">Nouveau Client</h2>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
              Nom Complet
            </label>
            <div className="relative">
              <UserPlus
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] font-bold outline-none border-2 border-transparent focus:border-blue-100 transition-all text-[#202042]"
                placeholder="Ex: Kouassi Koffi"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
              Téléphone
            </label>
            <div className="relative">
              <Phone
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] font-bold outline-none border-2 border-transparent focus:border-blue-100 transition-all text-[#202042]"
                placeholder="07 00 00 00 00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
              Plafond Crédit (FCFA)
            </label>
            <div className="relative">
              <Wallet
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                type="number"
                required
                value={formData.creditLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    creditLimit: Number(e.target.value),
                  })
                }
                className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] font-bold outline-none border-2 border-transparent focus:border-blue-100 transition-all text-[#202042]"
                placeholder="50000"
              />
            </div>
          </div>

          <button
            disabled={submitting}
            type="submit"
            className="w-full bg-[#202042] hover:bg-black text-white py-5 rounded-[25px] font-black flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            Enregistrer le Client
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default AddClient;
