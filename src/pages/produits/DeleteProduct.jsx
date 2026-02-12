import React, { useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Trash2, X } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const DeleteProduct = ({ product, onClose, refreshData }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const url = API_PATHS.PRODUCTS.DELETE_ONE.replace(":id", product._id);
      await API.delete(url);
      toast.success("Produit retiré du catalogue");
      refreshData();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Impossible de supprimer ce produit",
      );
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#202042]/40 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="bg-white p-10 rounded-[40px] relative shadow-2xl border border-rose-50 w-full max-w-sm animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[30px] flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>

          <h2 className="text-xl font-black text-[#202042] mb-2">
            Retirer du catalogue ?
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Voulez-vous vraiment supprimer <br />
            <span className="font-black text-rose-500 uppercase">
              {product.name}
            </span>{" "}
            ?
          </p>

          <div className="flex flex-col gap-3">
            <button
              disabled={loading}
              onClick={handleDelete}
              className="w-full py-4 bg-rose-500 text-white rounded-[20px] font-black uppercase text-[10px] tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />{" "}
              {loading ? "Suppression..." : "Confirmer la suppression"}
            </button>

            <button
              onClick={onClose}
              className="w-full py-4 bg-slate-50 text-slate-400 rounded-[20px] font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all"
            >
              Garder le produit
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default DeleteProduct;
