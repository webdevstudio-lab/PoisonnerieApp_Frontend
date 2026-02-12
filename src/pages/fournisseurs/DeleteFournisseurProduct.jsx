import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, AlertTriangle, Package } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const DeleteFournisseurProduct = ({
  supplierId,
  item,
  onClose,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const url = API_PATHS.SUPPLIER.CATALOG.DELETE_PRODUCT.replace(
        ":supplierId",
        supplierId,
      ).replace(":productId", item.product._id);

      const res = await API.delete(url);

      if (res.data.success) {
        toast.success("Produit retiré du catalogue");
        refreshData();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors du retrait");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#202042]/40 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="bg-white p-8 rounded-[40px] relative shadow-2xl border border-rose-50 w-full max-w-md animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-black text-[#202042] uppercase tracking-tight">
            Retirer l'article ?
          </h2>
          <p className="text-slate-400 text-xs font-bold mt-1">
            Ce produit ne sera plus lié à ce fournisseur
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-[30px] mb-8 border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-white text-rose-500 rounded-2xl flex items-center justify-center shadow-sm">
            <Package size={24} />
          </div>
          <div>
            <p className="font-black text-[#202042] uppercase text-sm">
              {item.product.name}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Prix actuel: {item.pricePurchase?.toLocaleString()} F
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            type="button"
            className="py-5 rounded-[25px] font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-100 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="py-5 bg-rose-500 text-white rounded-[25px] font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-100 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
          >
            <Trash2 size={16} />
            {loading ? "Retrait..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default DeleteFournisseurProduct;
