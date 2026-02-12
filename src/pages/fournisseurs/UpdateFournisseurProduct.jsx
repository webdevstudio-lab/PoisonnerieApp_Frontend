import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Tag, Save, RefreshCw } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const UpdateFournisseurProduct = ({
  supplierId,
  item,
  onClose,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(item.pricePurchase);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = API_PATHS.SUPPLIER.CATALOG.UPDATE_PRODUCT.replace(
        ":supplierId",
        supplierId,
      ).replace(":productId", item.product._id);

      // Correction : Utilisation de PATCH au lieu de PUT
      const res = await API.patch(url, { pricePurchase: parseFloat(price) });

      if (res.data.success) {
        toast.success("Tarif mis à jour !");
        refreshData();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#202042]/40 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="bg-white p-8 rounded-[40px] relative shadow-2xl border border-slate-100 w-full max-w-md animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Tag size={28} />
          </div>
          <h2 className="text-xl font-black text-[#202042] uppercase">
            Ajuster le Tarif
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            {item.product.name}
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
              Nouveau Prix d'Achat (FCFA)
            </label>
            <div className="relative">
              <input
                type="number"
                required
                autoFocus
                className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-amber-200 font-black text-xl text-[#202042]"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300">
                FCFA
              </span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-2">
              <RefreshCw size={12} className="animate-spin-slow" /> Mise à jour
              système
            </p>
            <p className="text-[11px] text-blue-700 font-medium mt-1 leading-relaxed">
              La modification recalculera la{" "}
              <span className="font-bold">marge potentielle</span> basée sur
              votre prix de vente global.
            </p>
          </div>

          <button
            disabled={loading}
            className="w-full py-5 bg-[#202042] text-white rounded-[25px] font-black uppercase text-[10px] tracking-widest shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Mise à jour..." : "Enregistrer le nouveau prix"}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UpdateFournisseurProduct;
