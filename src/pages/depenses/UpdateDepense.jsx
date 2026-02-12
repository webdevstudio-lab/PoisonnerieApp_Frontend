import React, { useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { X, Save, DollarSign, Tag, FileText, RefreshCw } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const UpdateDepense = ({ data, onClose, onSuccess, categories }) => {
  // Initialisation avec les données existantes
  const [formData, setFormData] = useState({
    label: data?.label || "",
    amount: data?.amount || "",
    category: data?.category?._id || data?.category || "",
    date: data?.date ? new Date(data.date).toISOString().split("T")[0] : "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category)
      return toast.error("Veuillez choisir une catégorie");
    if (!formData.amount || formData.amount <= 0)
      return toast.error("Montant invalide");

    setLoading(true);
    const loadToast = toast.loading("Mise à jour en cours...");

    try {
      const dataToSend = {
        ...formData,
        amount: Number(formData.amount),
      };

      // Utilisation du chemin dynamique pour la mise à jour
      await API.patch(`${API_PATHS.DEPENSES.GET_ALL}/${data._id}`, dataToSend);

      toast.success("Dépense mise à jour !", { id: loadToast });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      const msg =
        error.response?.data?.message || "Erreur lors de la mise à jour";
      toast.error(msg, { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center p-4 sm:p-6 bg-[#0f0f2d]/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* Overlay pour fermer au clic extérieur */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-[45px] p-6 sm:p-10 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[95vh]"
      >
        {/* BOUTON FERMER */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"
        >
          <X size={28} />
        </button>

        <h2 className="text-2xl font-black text-[#202042] uppercase mb-8 italic tracking-tighter">
          Modifier la Dépense
        </h2>

        <div className="space-y-5">
          {/* LIBELLÉ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#202042] uppercase ml-2">
              Libellé de la dépense
            </label>
            <div className="relative">
              <FileText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                required
                type="text"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-black text-[11px] uppercase focus:ring-2 focus:ring-amber-200 transition-all"
                placeholder="EX: ACHAT CARBURANT"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* MONTANT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#202042] uppercase ml-2">
                Montant (FCFA)
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  required
                  type="number"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-black text-[11px] focus:ring-2 focus:ring-amber-200 transition-all"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>
            </div>

            {/* CATÉGORIE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#202042] uppercase ml-2">
                Catégorie
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <select
                  required
                  className="w-full pl-12 pr-10 py-4 bg-slate-50 rounded-2xl outline-none font-black text-[11px] appearance-none uppercase focus:ring-2 focus:ring-amber-200 transition-all cursor-pointer"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Choisir...
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* DATE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#202042] uppercase ml-2">
              Date de l'opération
            </label>
            <input
              type="date"
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-black text-[11px] uppercase focus:ring-2 focus:ring-amber-200 transition-all"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="order-2 sm:order-1 flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-200 transition-all"
          >
            Annuler
          </button>
          <button
            disabled={loading}
            type="submit"
            className="order-1 sm:order-2 flex-[2] py-4 bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-amber-900/10 flex items-center justify-center gap-2 hover:bg-amber-600 transition-all disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {loading ? "Mise à jour..." : "Appliquer les modifications"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

export default UpdateDepense;
