import React, { useState, useEffect } from "react";
import { X, Store, MapPin, Wallet, Save, RefreshCw } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const UpdateSale = ({ sale, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    dette: 0,
  });
  const [loading, setLoading] = useState(false);

  // On remplit le formulaire dès que le composant monte ou que 'sale' change
  useEffect(() => {
    if (sale) {
      setFormData({
        name: sale.name || "",
        location: sale.location || "",
        dette: sale.dette || 0,
      });
    }
  }, [sale]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadToast = toast.loading("Mise à jour en cours...");

    try {
      // On utilise .replace(":id", sale._id) pour injecter l'ID dans l'URL
      const url = API_PATHS.SALES.UPDATE_ONE.replace(":id", sale._id);

      const res = await API.put(url, formData);

      if (res.data.success) {
        toast.success("Point de vente mis à jour !", { id: loadToast });
        refreshData(); // Rafraîchit la liste dans AllSales
        onClose(); // Ferme le modal
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Erreur lors de la modification",
        { id: loadToast },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] relative">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 transition-colors"
      >
        <X size={20} />
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <RefreshCw size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#202042]">
          Modifier le Point
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Mise à jour de : <span className="text-[#3498DB]">{sale?.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Champ Nom */}
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
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-amber-100 font-bold text-[#202042] transition-all"
              placeholder="Ex: Boutique Port-Bouët"
            />
          </div>
        </div>

        {/* Champ Localisation */}
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
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-amber-100 font-bold text-[#202042] transition-all"
              placeholder="Adresse ou quartier"
            />
          </div>
        </div>

        {/* Champ Dette */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Ajuster la Dette (F)
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
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-amber-100 font-bold text-[#202042] transition-all"
            />
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-4 bg-[#202042] text-white rounded-[22px] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            "Modification..."
          ) : (
            <>
              <Save size={18} /> Enregistrer les modifications
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateSale;
