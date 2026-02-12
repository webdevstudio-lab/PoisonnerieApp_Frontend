import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Edit3, Save } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const UpdateSupplier = ({ supplier, onClose, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: supplier?.name || "",
    contact: supplier?.contact || "",
    address: supplier?.address || "",
    category: supplier?.category || "grossiste",
    balance: supplier?.balance || 0, // Harmonisé avec balance
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Utilisation du path UPDATE_ONE en remplaçant :id
      const url = API_PATHS.SUPPLIER.UPDATE_ONE.replace(":id", supplier._id);

      // CHANGEMENT ICI : .patch au lieu de .put pour matcher ta route Express
      const res = await API.patch(url, form);

      if (res.data.success) {
        toast.success("Fournisseur mis à jour !");
        refreshData();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de modification");
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
          className="absolute top-6 right-6 text-slate-300 hover:text-indigo-500 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Edit3 size={32} />
          </div>
          <h2 className="text-2xl font-black text-[#202042]">
            Modifier Partenaire
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            {supplier.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
              Nom commercial
            </label>
            <input
              required
              className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-blue-100 font-bold uppercase"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                Contact
              </label>
              <input
                required
                className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-blue-100 font-bold"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                Catégorie
              </label>
              <select
                className="w-full px-6 py-4 bg-slate-50 rounded-[22px] font-bold outline-none border-2 border-transparent focus:border-blue-100"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="grossiste">Grossiste</option>
                <option value="revendeur">Revendeur</option>
                <option value="autres">Autres</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
              Adresse
            </label>
            <input
              className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-blue-100 font-bold"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-5 bg-[#202042] text-white rounded-[25px] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Save size={18} />
            {loading ? "Mise à jour..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UpdateSupplier;
