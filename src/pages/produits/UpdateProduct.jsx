import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Edit3, Scale, AlertTriangle, Save, Banknote } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const UpdateProduct = ({ product, onClose, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || "",
    category: product?.category || "poisson",
    weightPerCarton: product?.weightPerCarton || "",
    sellingPrice: product?.sellingPrice || "", // Ajouté pour cohérence
    lowStockThreshold: product?.lowStockThreshold || 5,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = API_PATHS.PRODUCTS.UPDATE_ONE.replace(":id", product._id);
      const res = await API.patch(url, {
        ...form,
        weightPerCarton: parseFloat(form.weightPerCarton),
        sellingPrice: parseFloat(form.sellingPrice),
        lowStockThreshold: parseInt(form.lowStockThreshold),
      });

      if (res.data.success) {
        toast.success("Référence mise à jour !");
        refreshData();
        onClose();
      }
    } catch (err) {
      toast.error("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#202042]/40 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="bg-white p-8 rounded-[40px] relative shadow-2xl border border-slate-100 w-full max-w-lg animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-300 hover:text-blue-500 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Edit3 size={32} />
          </div>
          <h2 className="text-2xl font-black text-[#202042]">
            Modifier Référence
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase italic tracking-widest">
            {product.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
              Désignation
            </label>
            <input
              required
              className="w-full px-6 py-4 bg-slate-50 rounded-[22px] font-bold uppercase outline-none border-2 border-transparent focus:border-blue-100"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value.toUpperCase() })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                Poids (kg)
              </label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full px-6 py-4 bg-slate-50 rounded-[22px] font-bold outline-none"
                value={form.weightPerCarton}
                onChange={(e) =>
                  setForm({ ...form, weightPerCarton: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-emerald-600 uppercase ml-4">
                Prix Vente
              </label>
              <div className="relative">
                <Banknote
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400"
                  size={16}
                />
                <input
                  type="number"
                  required
                  className="w-full pl-10 pr-4 py-4 bg-emerald-50/50 rounded-[22px] font-black text-emerald-700 outline-none"
                  value={form.sellingPrice}
                  onChange={(e) =>
                    setForm({ ...form, sellingPrice: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-[30px] border border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-3 text-amber-600 ml-2">
              <AlertTriangle size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Alerte Stock
              </p>
            </div>
            <input
              type="number"
              className="w-20 py-2 bg-white rounded-[15px] outline-none font-black text-center text-amber-600 shadow-inner"
              value={form.lowStockThreshold}
              onChange={(e) =>
                setForm({ ...form, lowStockThreshold: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-5 bg-[#202042] text-white rounded-[25px] font-black uppercase text-[10px] tracking-widest shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Save size={18} />{" "}
            {loading ? "Mise à jour..." : "Appliquer les changements"}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UpdateProduct;
