import React, { useState } from "react";
import { X, Store, MapPin, Wallet, Save } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const AddSale = ({ onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    dette: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadToast = toast.loading("Création du point de vente...");

    try {
      await API.post(API_PATHS.SALES.ADD_ONE, formData);
      toast.success("Point de vente ajouté !", { id: loadToast });
      refreshData();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de création", {
        id: loadToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] relative">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500"
      >
        <X />
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Store size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#202042]">Nouveau Point</h2>
        <p className="text-slate-400 text-sm">
          Ouvrez un nouvel emplacement de vente
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Nom du point
          </label>
          <div className="relative">
            <Store
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-blue-100 font-bold"
              placeholder="Ex: Boutique Port-Bouët"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Localisation
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-blue-100 font-bold"
              placeholder="Adresse ou quartier"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Dette Initiale (F)
          </label>
          <div className="relative">
            <Wallet
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="number"
              value={formData.dette}
              onChange={(e) =>
                setFormData({ ...formData, dette: e.target.value })
              }
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-blue-100 font-bold"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-4 bg-[#3498DB] text-white rounded-[22px] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg flex items-center justify-center gap-3"
        >
          <Save size={18} /> Enregistrer le point
        </button>
      </form>
    </div>
  );
};

export default AddSale;
