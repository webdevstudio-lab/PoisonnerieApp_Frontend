import React, { useState, useEffect } from "react";
import {
  X,
  ArrowRightLeft,
  Package,
  Send,
  AlertCircle,
  RefreshCcw, // <-- Il manquait celui-là
} from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";

const TransferModal = ({ sourceStore, onClose, refreshData }) => {
  const [destStores, setDestStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destinationStoreId: "",
    productId: "",
    quantity: 1,
  });

  // 1. Charger les autres dépôts pour la destination via API_PATHS
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await API.get(API_PATHS.STORES.GET_ALL);
        if (res.data.success) {
          // Filtrer pour exclure le dépôt source actuel
          const filtered = res.data.data.filter(
            (s) => s._id !== sourceStore?._id,
          );
          setDestStores(filtered);
        }
      } catch (err) {
        toast.error("Impossible de charger les dépôts de destination");
      }
    };
    fetchDestinations();
  }, [sourceStore]);

  // Trouver le produit sélectionné pour valider le stock max
  const selectedProductStock = sourceStore?.items?.find(
    (item) => item.product._id === formData.productId,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de sécurité avant envoi
    if (formData.quantity > (selectedProductStock?.quantityCartons || 0)) {
      return toast.error("La quantité dépasse le stock disponible !");
    }

    setLoading(true);
    try {
      // Utilisation du chemin centralisé API_PATHS.STORES.TRANSFER
      await API.post(API_PATHS.STORES.TRANSFER, {
        fromStoreId: sourceStore._id,
        toStoreId: formData.destinationStoreId,
        productId: formData.productId,
        quantityCartons: parseInt(formData.quantity),
      });

      toast.success("Stock transféré avec succès");
      refreshData(); // Rafraîchir les données de la page parente
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors du transfert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] relative shadow-2xl border border-slate-100 w-full max-w-lg">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"
      >
        <X />
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <ArrowRightLeft size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#202042]">
          Transfert de Stock
        </h2>
        <p className="text-slate-400 text-sm italic">
          Déplacement :{" "}
          <span className="text-indigo-500 font-bold">{sourceStore?.name}</span>{" "}
          vers...
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PRODUIT À TRANSFÉRER */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Produit à déplacer
          </label>
          <select
            required
            className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-indigo-100 font-bold text-[#202042]"
            value={formData.productId}
            onChange={(e) =>
              setFormData({
                ...formData,
                productId: e.target.value,
                quantity: 1,
              })
            }
          >
            <option value="">Sélectionner un produit...</option>
            {sourceStore?.items?.map((item) => (
              <option
                key={item.product._id}
                value={item.product._id}
                disabled={item.quantityCartons <= 0}
              >
                {item.product.name} ({item.quantityCartons} cartons dispos)
              </option>
            ))}
          </select>
        </div>

        {/* DESTINATION */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Dépôt de destination
          </label>
          <select
            required
            className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-indigo-100 font-bold text-[#202042]"
            value={formData.destinationStoreId}
            onChange={(e) =>
              setFormData({ ...formData, destinationStoreId: e.target.value })
            }
          >
            <option value="">Vers quel entrepôt ?</option>
            {destStores.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.salePoint?.name || "Sans point de vente"})
              </option>
            ))}
          </select>
        </div>

        {/* QUANTITÉ */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Nombre de cartons
            </label>
            {selectedProductStock && (
              <span className="text-[10px] font-bold text-indigo-400">
                Max: {selectedProductStock.quantityCartons}
              </span>
            )}
          </div>
          <div className="relative">
            <Package
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="number"
              min="1"
              max={selectedProductStock?.quantityCartons || 1}
              required
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-indigo-100 font-bold text-[#202042]"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
          </div>
        </div>

        {/* RÉCAPITULATIF VISUEL */}
        <div className="p-4 bg-indigo-50/50 rounded-2xl flex items-start gap-3 text-indigo-600 border border-indigo-100">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-[10px] font-black uppercase tracking-wider leading-relaxed">
            Cette action est irréversible. Le stock sera immédiatement déduit du
            dépôt source après confirmation.
          </p>
        </div>

        <button
          disabled={
            loading || !formData.destinationStoreId || !formData.productId
          }
          className="w-full py-4 bg-[#202042] text-white rounded-[22px] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed hover:bg-indigo-600"
        >
          {loading ? (
            <RefreshCcw size={18} className="animate-spin" />
          ) : (
            <>
              <Send size={18} /> Confirmer l'envoi
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransferModal;
