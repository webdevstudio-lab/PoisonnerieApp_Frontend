import React, { useState, useEffect } from "react";
import {
  Store,
  DollarSign,
  Calendar,
  FileText,
  Send,
  Loader2,
} from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";

const VersementModal = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [boutiques, setBoutiques] = useState([]);
  const [formData, setFormData] = useState({
    salePointId: "",
    amount: "",
    paymentMethod: "CASH",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  useEffect(() => {
    const fetchBoutiques = async () => {
      try {
        const res = await API.get(API_PATHS.SALES.GET_ALL);
        if (res.data.success) setBoutiques(res.data.data);
      } catch (err) {
        toast.error("Impossible de charger les boutiques");
      }
    };
    fetchBoutiques();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.salePointId || !formData.amount)
      return toast.error("Champs obligatoires manquants");
    try {
      setLoading(true);
      const res = await API.post(API_PATHS.VERSEMENTS.CREATE, formData);
      if (res.data.success) {
        toast.success("Versement enregistré !");
        onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'opération");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#202042] flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-[#3498DB] rounded-2xl flex items-center justify-center">
            <Store size={20} />
          </div>
          Nouveau Versement
        </h2>
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mt-1 ml-13">
          Alimenter la caisse centrale
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Boutique Source */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
            Boutique Source *
          </label>
          <div className="relative">
            <Store
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={16}
            />
            <select
              name="salePointId"
              value={formData.salePointId}
              onChange={(e) =>
                setFormData({ ...formData, salePointId: e.target.value })
              }
              className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-[#202042] outline-none focus:ring-2 focus:ring-blue-100 appearance-none"
            >
              <option value="">Sélectionner...</option>
              {boutiques.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} — Solde: {b.solde?.toLocaleString()} F
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Montant & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              Montant (F) *
            </label>
            <div className="relative">
              <DollarSign
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-[#202042] outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-[#202042] outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Méthode */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
            Méthode
          </label>
          <div className="flex gap-2">
            {["Espèces", "Chèque", "Virement", "Mobile Money"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: m })}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black border-2 transition-all ${
                  formData.paymentMethod === m
                    ? "bg-[#202042] border-[#202042] text-white"
                    : "bg-white border-slate-50 text-slate-400"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
            Note / Justificatif
          </label>
          <div className="relative">
            <FileText
              className="absolute left-4 top-4 text-slate-300"
              size={16}
            />
            <textarea
              rows="2"
              placeholder="Commentaire..."
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-[#202042] outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-[#3498DB] hover:bg-[#202042] text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Send size={16} /> ENREGISTRER LE FLUX
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default VersementModal;
