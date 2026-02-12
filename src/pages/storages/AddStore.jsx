import React, { useState, useEffect } from "react";
import { X, Warehouse, Save, MapPin } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const AddStore = ({ onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    name: "",
    salePoint: "",
    type: "principal",
  });
  const [salePoints, setSalePoints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalePoints = async () => {
      const res = await API.get(API_PATHS.SALES.GET_ALL);
      if (res.data.success) setSalePoints(res.data.data);
    };
    fetchSalePoints();
  }, []);

  /**
   * Gestionnaire de changement pour le point de vente
   * Met à jour l'ID et génère automatiquement le nom du store
   */
  const handleSalePointChange = (e) => {
    const selectedId = e.target.value;

    // Trouver l'objet complet de la boutique sélectionnée
    const selectedShop = salePoints.find((sp) => sp._id === selectedId);

    if (selectedShop) {
      // On formate le nom : "Stock_NomDeLaBoutique"
      // .replace(/\s+/g, '_') est optionnel, il remplace les espaces par des underscores
      const autoName = `Stock_${selectedShop.name}`;

      setFormData({
        ...formData,
        salePoint: selectedId,
        name: autoName,
      });
    } else {
      setFormData({ ...formData, salePoint: "", name: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.salePoint)
      return toast.error("Veuillez choisir un point de vente");
    setLoading(true);
    try {
      await API.post(API_PATHS.STORES.ADD_ONE, formData);
      toast.success("Dépôt créé avec succès");
      refreshData();
      onClose();
    } catch (err) {
      toast.error(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] relative shadow-2xl">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-slate-300 hover:text-rose-500"
      >
        <X />
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Warehouse size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#202042]">Nouveau Dépôt</h2>
        <p className="text-slate-400 text-sm">Créez un espace de stockage</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* POINT DE VENTE (Placé en premier pour la logique d'auto-remplissage) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Point de Vente Rattaché
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <select
              required
              value={formData.salePoint}
              onChange={handleSalePointChange} // Utilisation de la nouvelle fonction
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-emerald-100 font-bold appearance-none"
            >
              <option value="">Sélectionner un point...</option>
              {salePoints.map((sp) => (
                <option key={sp._id} value={sp._id}>
                  {sp.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* NOM DU DEPOT (Auto-rempli mais reste modifiable) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Nom du Dépôt
          </label>
          <input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-emerald-100 font-bold"
            placeholder="Le nom sera généré automatiquement..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Type de Stock
          </label>
          <div className="flex gap-4">
            {["principal", "secondaire"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  formData.type === t
                    ? "bg-[#202042] text-white shadow-lg"
                    : "bg-slate-50 text-slate-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-4 bg-[#2ECC71] text-white rounded-[22px] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg flex items-center justify-center gap-3"
        >
          <Save size={18} /> {loading ? "Création..." : "Créer l'entrepôt"}
        </button>
      </form>
    </div>
  );
};

export default AddStore;
