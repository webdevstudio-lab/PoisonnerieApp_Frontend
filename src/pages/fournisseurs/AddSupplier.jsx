import React, { useState } from "react";
import { createPortal } from "react-dom"; // Importation du Portal
import { X, UserPlus, Phone, MapPin, Save, Banknote } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const AddSupplier = ({ onClose, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    category: "grossiste",
    balance: 0, // Harmonisé avec ton modèle Mongoose
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Transformation des données numériques
      const payload = {
        ...form,
        balance: parseFloat(form.balance) || 0,
      };

      const res = await API.post(API_PATHS.SUPPLIER.ADD_ONE, payload);
      if (res.data.success) {
        toast.success("Fournisseur ajouté avec succès !");
        refreshData();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  // Contenu du Modal
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#202042]/40 backdrop-blur-md">
      {/* Overlay pour fermer au clic extérieur */}
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
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-2xl font-black text-[#202042]">
            Nouveau Partenaire
          </h2>
          <p className="text-slate-400 text-[10px] italic uppercase tracking-widest font-black">
            Enregistrement fournisseur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
              Nom du fournisseur
            </label>
            <input
              required
              className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-indigo-100 font-bold uppercase"
              placeholder="Ex: PÊCHERIES DU SUD"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                Téléphone
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <input
                  required
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-indigo-100 font-bold"
                  placeholder="0700000000"
                  value={form.contact}
                  onChange={(e) =>
                    setForm({ ...form, contact: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                Catégorie
              </label>
              <select
                className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-indigo-100 font-bold cursor-pointer"
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
              Adresse Géographique
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-indigo-100 font-bold"
                placeholder="Abidjan, Zone 4..."
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-rose-400 uppercase ml-4">
              Solde Initial (Dette actuelle)
            </label>
            <div className="relative">
              <Banknote
                className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-300"
                size={18}
              />
              <input
                type="number"
                className="w-full pl-12 pr-6 py-4 bg-rose-50/30 rounded-[22px] outline-none border-2 border-transparent focus:border-rose-100 font-black text-rose-500"
                value={form.balance}
                onChange={(e) => setForm({ ...form, balance: e.target.value })}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-[25px] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all mt-4 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Enregistrement..." : "Créer le fournisseur"}
          </button>
        </form>
      </div>
    </div>
  );

  // Rendu via Portal dans document.body
  return createPortal(modalContent, document.body);
};

export default AddSupplier;
