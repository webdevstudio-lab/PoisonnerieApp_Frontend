import React, { useState } from "react";
import { createPortal } from "react-dom"; // Import indispensable pour le Portal
import { X, Package, Scale, AlertTriangle, Save, Banknote } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const AddProduct = ({ onClose, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "poisson",
    weightPerCarton: "",
    sellingPrice: "",
    lowStockThreshold: 2,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        weightPerCarton: parseFloat(form.weightPerCarton),
        sellingPrice: parseFloat(form.sellingPrice),
        lowStockThreshold: parseInt(form.lowStockThreshold),
      };

      const res = await API.post(API_PATHS.PRODUCTS.ADD_ONE, payload);
      if (res.data.success) {
        toast.success("Référence ajoutée au catalogue global !");
        refreshData();
        onClose();
      }
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  // Contenu du Modal à "téléporter"
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#202042]/40 backdrop-blur-sm">
      {/* Overlay cliquable pour fermer */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="bg-white p-8 rounded-[40px] relative shadow-2xl border border-slate-100 w-full max-w-lg animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique sur le formulaire
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Package size={32} />
          </div>
          <h2 className="text-2xl font-black text-[#202042]">Nouvel Article</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
            Référence Catalogue Global
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NOM DU PRODUIT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
              Désignation du produit
            </label>
            <input
              required
              autoFocus
              className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-emerald-100 font-bold uppercase"
              placeholder="Ex: MAQUEREAU 25+"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CATEGORIE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                Catégorie
              </label>
              <select
                className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none font-bold cursor-pointer border-2 border-transparent focus:border-emerald-100"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="poisson">🐟 Poisson</option>
                <option value="viande">🥩 Viande</option>
              </select>
            </div>

            {/* POIDS CARTON */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-500 uppercase ml-4">
                Poids Carton (kg)
              </label>
              <div className="relative">
                <Scale
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-blue-100 font-bold"
                  placeholder="20"
                  value={form.weightPerCarton}
                  onChange={(e) =>
                    setForm({ ...form, weightPerCarton: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* PRIX DE VENTE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-600 uppercase ml-4">
              Prix de Vente Unitaire (Carton)
            </label>
            <div className="relative">
              <Banknote
                className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400"
                size={18}
              />
              <input
                type="number"
                required
                className="w-full pl-12 pr-6 py-4 bg-emerald-50/50 rounded-[22px] outline-none border-2 border-transparent focus:border-emerald-200 font-black text-emerald-700"
                placeholder="Ex: 25000"
                value={form.sellingPrice}
                onChange={(e) =>
                  setForm({ ...form, sellingPrice: e.target.value })
                }
              />
            </div>
          </div>

          {/* SEUIL ALERTE STOCK */}
          <div className="bg-amber-50 p-4 rounded-[30px] border border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-3 text-amber-600 ml-2">
              <AlertTriangle size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Alerte Stock (Cartons)
              </p>
            </div>
            <input
              type="number"
              className="w-20 py-2 bg-white rounded-[15px] outline-none font-black text-center text-amber-600 shadow-inner border border-amber-200"
              value={form.lowStockThreshold}
              onChange={(e) =>
                setForm({ ...form, lowStockThreshold: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-5 bg-[#202042] text-white rounded-[25px] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 hover:bg-[#2d2d5a] active:scale-95 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Enregistrement..." : "Créer la référence"}
          </button>
        </form>
      </div>
    </div>
  );

  // Utilisation de createPortal pour injecter dans document.body
  return createPortal(modalContent, document.body);
};

export default AddProduct;
