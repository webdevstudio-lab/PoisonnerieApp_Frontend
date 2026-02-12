import React, { useState } from "react";
import { X, AlertOctagon, Trash2, Info, RefreshCcw } from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";

const LossModal = ({ store, onClose, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
    reason: "Avarie", // "Avarie", "Vol", "Erreur Inventaire", "Casse"
  });

  // Trouver le produit sélectionné pour limiter la quantité max
  const selectedProduct = store?.items?.find(
    (item) => item.product._id === formData.productId,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de sécurité locale
    if (formData.quantity > (selectedProduct?.quantityCartons || 0)) {
      return toast.error("La quantité dépasse le stock disponible !");
    }

    setLoading(true);
    try {
      // Utilisation du chemin dynamique : /stores/:id/loss
      const url = API_PATHS.STORES.DECLARE_LOSS.replace(":id", store._id);

      await API.post(url, {
        productId: formData.productId,
        quantityCartons: parseInt(formData.quantity),
        reason: formData.reason,
      });

      toast.success("Perte enregistrée. Stock mis à jour.");
      refreshData();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de la déclaration",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] relative shadow-2xl border border-slate-100 w-full max-w-lg">
      {/* BOUTON FERMER */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"
      >
        <X />
      </button>

      {/* HEADER DU MODAL */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertOctagon size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#202042] uppercase tracking-tight">
          Déclarer une Perte
        </h2>
        <p className="text-slate-400 text-sm italic">
          Dépôt : <span className="text-rose-500 font-bold">{store?.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SÉLECTION DU PRODUIT */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Produit concerné
          </label>
          <select
            required
            className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-rose-100 font-bold text-[#202042]"
            value={formData.productId}
            onChange={(e) =>
              setFormData({
                ...formData,
                productId: e.target.value,
                quantity: 1,
              })
            }
          >
            <option value="">Sélectionner le produit...</option>
            {store?.items?.map((item) => (
              <option
                key={item.product._id}
                value={item.product._id}
                disabled={item.quantityCartons <= 0}
              >
                {item.product.name} ({item.quantityCartons} en stock)
              </option>
            ))}
          </select>
        </div>

        {/* GRILLE QUANTITÉ & MOTIF */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Quantité
              </label>
              {selectedProduct && (
                <span className="text-[9px] font-bold text-rose-400">
                  Max: {selectedProduct.quantityCartons}
                </span>
              )}
            </div>
            <input
              type="number"
              min="1"
              max={selectedProduct?.quantityCartons || 1}
              required
              className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-rose-100 font-bold text-rose-600"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
              Motif du retrait
            </label>
            <select
              className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-rose-100 font-bold text-[#202042]"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            >
              <option value="Avarie">Avarie (Gâté)</option>
              <option value="Vol">Vol</option>
              <option value="Erreur Inventaire">Erreur Inventaire</option>
              <option value="Casse">Casse / Dommage</option>
            </select>
          </div>
        </div>

        {/* MESSAGE D'ALERTE INFO */}
        <div className="p-4 bg-rose-50/50 rounded-2xl flex items-start gap-3 text-rose-600 border border-rose-100">
          <Info size={20} className="shrink-0 mt-0.5" />
          <p className="text-[10px] font-black leading-relaxed uppercase tracking-wider">
            Attention : Ce retrait est définitif. Cette opération sera tracée
            comme une sortie exceptionnelle.
          </p>
        </div>

        {/* BOUTON D'ACTION */}
        <button
          disabled={loading || !formData.productId}
          className="w-full py-4 bg-rose-500 text-white rounded-[22px] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-rose-100 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed hover:bg-rose-600"
        >
          {loading ? (
            <RefreshCcw size={18} className="animate-spin" />
          ) : (
            <>
              <Trash2 size={18} /> Valider le retrait
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LossModal;
