import React, { useState, useEffect } from "react";
import { X, Warehouse, Save, MapPin, RefreshCcw } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const UpdateStore = ({ store, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    name: "",
    salePoint: "",
    type: "principal",
  });
  const [salePoints, setSalePoints] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Charger les points de vente et initialiser le formulaire
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(API_PATHS.SALES.GET_ALL);
        if (res.data.success) {
          setSalePoints(res.data.data);
        }

        // Initialisation avec les données du store à modifier
        if (store) {
          setFormData({
            name: store.name || "",
            salePoint: store.salePoint?._id || store.salePoint || "",
            type: store.type || "principal",
          });
        }
      } catch (err) {
        toast.error("Erreur lors du chargement des données");
      }
    };
    fetchData();
  }, [store]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.salePoint)
      return toast.error("Veuillez choisir un point de vente");

    setLoading(true);
    const loadToast = toast.loading("Mise à jour du dépôt...");

    try {
      // On utilise l'ID du store passé en prop pour construire l'URL
      const url = API_PATHS.STORES.UPDATE_ONE.replace(":id", store._id);
      const res = await API.patch(url, formData);

      if (res.data.success) {
        toast.success("Dépôt mis à jour avec succès", { id: loadToast });
        refreshData();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de modification", {
        id: loadToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] relative shadow-2xl border border-slate-100">
      {/* Bouton Fermer */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 transition-colors"
      >
        <X size={20} />
      </button>

      {/* Header du Modal */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <RefreshCcw size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#202042]">
          Modifier le Dépôt
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Mise à jour de :{" "}
          <span className="text-blue-500 font-bold">{store?.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Champ Nom */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Nom de l'entrepôt
          </label>
          <div className="relative">
            <Warehouse
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-blue-100 font-bold text-[#202042] transition-all"
              placeholder="Ex: Chambre Froide Centrale"
            />
          </div>
        </div>

        {/* Sélection du Point de Vente */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Rattachement Logistique
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <select
              required
              value={formData.salePoint}
              onChange={(e) =>
                setFormData({ ...formData, salePoint: e.target.value })
              }
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-blue-100 font-bold text-[#202042] appearance-none"
            >
              <option value="">Changer le point de vente...</option>
              {salePoints.map((sp) => (
                <option key={sp._id} value={sp._id}>
                  {sp.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type de Stock (Toggle) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Classification du stock
          </label>
          <div className="flex gap-3">
            {["principal", "secondaire"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={`flex-1 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-[0.15em] transition-all border-2 ${
                  formData.type === t
                    ? "bg-[#202042] border-[#202042] text-white shadow-lg shadow-blue-900/20"
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                }`}
              >
                Stock {t}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton de validation */}
        <button
          disabled={loading}
          type="submit"
          className="w-full py-4 bg-[#2ECC71] hover:bg-[#27ae60] text-white rounded-[22px] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-emerald-100 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 mt-4"
        >
          {loading ? (
            "Enregistrement..."
          ) : (
            <>
              <Save size={18} /> Appliquer les modifications
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateStore;
